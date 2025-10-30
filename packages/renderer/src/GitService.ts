import {reactive,watch} from 'vue';
import ArcControlService from './ArcControlService.ts';
import AppProperties from './AppProperties.ts';

interface Branches {
  list: string[],
  current: string|null
}

export interface LFSJsonFile {
  name: string,
  size: number,
  checkout: boolean,
  downloaded: boolean
  oid_type: string
  oid: string
  version: string
}

export interface LFSJsonResponse {
  files: LFSJsonFile[]
}

const GitService = {

  _: reactive({
    remotes: {},
    branches: null as Branches|null,

    lfs_files: new Map(),
    lfs_size_limit: 1,

    rebase_in_progress: false,

    change_tree: [],
    change_tree_map: new Map(),
    change_tree_expanded: [],
    change_tree_selected: [],
    change_tree_selected_: [],

    lfs_blacklist: {
      starts:['isa.','.git'],
      ends: ['.cwl','.yml','.yaml']
    }
  }),

  is_not_lfs_blacklisted: id=>
       !GitService._.lfs_blacklist.starts.some(i=>id.startsWith(i))
    && !GitService._.lfs_blacklist.ends.some(i=>id.endsWith(i))
    && !GitService._.change_tree_map.get(id).types.includes('D')
  ,

  get_leaf_nodes: (nodes,node) => {
    node = node || GitService._.change_tree[0];
    if(node.children_.length<1)
      return nodes.push(node);
    node.children_.map(c=>GitService.get_leaf_nodes(nodes,c));
  },

  build_change_tree: status => {
    const root = [{
      id: '.',
      name: 'Changes',
      children: [],
      children_: [],
      types: '',
      header: 'root'
    }];

    const unselect = nodes => {
      for(let n of nodes){
        const idx = GitService._.change_tree_selected.indexOf(n.id);
        idx>=0 && GitService._.change_tree_selected.splice(idx,1);
      }
    };
    const select = nodes => {
      for(let n of nodes){
        const idx = GitService._.change_tree_selected.indexOf(n.id);
        idx<0 && GitService._.change_tree_selected.push(n.id);
      }
      GitService._.change_tree_selected = GitService._.change_tree_selected.filter(GitService.is_not_lfs_blacklisted);
    };

    const handler = node => {
      const leaf_nodes = [];
      GitService.get_leaf_nodes(leaf_nodes,node);

      const n_selected = leaf_nodes.filter(n=>GitService._.change_tree_selected.includes(n.id)).length;
      if(n_selected===0)
        select(leaf_nodes);
      else
        unselect(leaf_nodes);

      GitService.mark_lfs_nodes();
    };

    status.forEach(([type,path,size]) => {
      const segments = path.split('/');
      let parent = root[0];
      let children_ = parent.children_;
      for(let s=0; s<segments.length; s++){
        const segment = segments[s];
        const subpath = segments.slice(0,s+1).join('/');
        let node = children_.filter(n=>n.id===subpath)[0];
        if(!node){
          node = {
            id: subpath,
            name: segment,
            children: [], // rendered children
            children_: [], // true children
            size: 0,
            lazy: s!==segments.length-1,
            parent: parent,
            handler: handler,
            types: ''
          };
          children_.push(node);
          GitService._.change_tree_map.set(node.id,node);
        }
        node.size += size;
        if(s===segments.length-1)
          node.type = type;
        parent = node;
        children_ = parent.children_;
      }
    });

    // propagate types
    {
      const leaf_nodes = [];
      GitService.get_leaf_nodes(leaf_nodes,root[0]);
      for(let node of leaf_nodes){
        let type = node.type;
        let temp = node;
        while(temp && !temp.types.includes(type)){
          temp.types += type;
          temp = temp.parent;
        }
      }
    }

    // sort children
    {
      const sortChildren = node => {
        node.children_.sort((a,b)=>
          a.children_.length>0 && b.children_.length===0
            ? -1
            : b.children_.length>0 && a.children_.length===0
              ? 1
              : a.id.localeCompare(b.id)
        )
        node.children_.map(n=>sortChildren(n));
      }
      root[0].children_.map(n=>sortChildren(n));
    }

    GitService._.change_tree = root;

    return root;
  },

  mark_lfs_nodes: ()=>{
    GitService._.change_tree_map.forEach(n=>n.containsLFS=false);
    for(let id of GitService._.change_tree_selected){
      let temp = GitService._.change_tree_map.get(id);
      while(temp && !temp.containsLFS){
        temp.containsLFS = true;
        temp = temp.parent;
      }
    }
  },

  select_lfs_nodes: async ()=>{
    await GitService.update_lfs_files();
    GitService._.change_tree_selected = [];
    const init_select_nodes = node => {
      if(
           node.children_.length<1
        && GitService.is_not_lfs_blacklisted(node.id)
        && (
          node.id.toLowerCase().includes('/dataset/')
          || node.size>=parseFloat(GitService._.lfs_size_limit)*1024*1024
          || GitService._.lfs_files.has(node.id)
        )
      )
        GitService._.change_tree_selected.push(node.id)
      node.children_.map(init_select_nodes);
    };
    GitService._.change_tree[0].children_.map(init_select_nodes);

    GitService.mark_lfs_nodes();
  },

  get_status: async () => {
    let tryBranch : string | null = null;
    const status_raw: [boolean, any] = await window.ipc.invoke('GitService.run', {
      args: [`status`],
      cwd: ArcControlService.props.arc_root
    });

    if (!status_raw[0])
      return Error('Unable to access git status');

    const statusLines = status_raw[1].split(/\r?\n/);

    for (const line of statusLines) {
      const match = line.match(/^On branch (\S+)/);
      if (match) {
        tryBranch = match[1]; // return branch name
      }
    }

    return {
      raw: status_raw,
      currentBranch: tryBranch
    }
  },

  parse_status: async ()=>{
    const status_raw = await window.ipc.invoke('GitService.run', {
      args: [`status`],
      cwd: ArcControlService.props.arc_root
    });
    GitService._.rebase_in_progress = status_raw[1].startsWith('interactive rebase in progress');

    const response = await window.ipc.invoke('GitService.run', {
      args: [`status`,`-z`,`-u`],
      cwd: ArcControlService.props.arc_root
    });
    const status = response[1].split('\u0000').map(x => [x.slice(0,2),x.slice(3)]).slice(0,-1);
    const sizes = await window.ipc.invoke('LocalFileSystemService.getFileSizes', status.map(x=> ArcControlService.props.arc_root +'/'+x[1]));
    for(let i in sizes)
      status[i].push(sizes[i]);

    GitService.build_change_tree(status);
    GitService.select_lfs_nodes();
    GitService._.change_tree_expanded = ['.'];
    {
      const expand_children = node => {
        if(node.children_.length>5){
          node.lazy = true;
        } else {
          node.children = node.children_;
          for(let child of node.children)
            expand_children(child);
        };
      }
      GitService._.change_tree[0].children = GitService._.change_tree[0].children_;
      for(let child of GitService._.change_tree[0].children)
        expand_children(child);
    }
  },

  load: async ({node, key, done, fail}) => {
    done(node.children_);
  },

  update_lfs_files: async () => {
    if(false){
      const lfs_files = await window.ipc.invoke('GitService.run', {
        args: ['lfs','ls-files'],
        cwd: ArcControlService.props.arc_root
      });
      if(!lfs_files[0])
        return console.error('unable to fetch LFS file list');

      GitService._.lfs_files = new Map();

      lfs_files[1].split('\n').map(
        r=>{
          const e = r.split(' ');
          GitService._.lfs_files.set(e.slice(2).join(' '), e[1]==='*');
        }
      );
    } else {
      // read git attributes
      const gitattributesRaw = await window.ipc.invoke('LocalFileSystemService.readFile', ArcControlService.props.arc_root+'/.gitattributes');
      GitService._.lfs_files = new Map();
      gitattributesRaw.split('\n').map(r=>{
        const next = r.split(' filter=lfs ')[0]
        GitService._.lfs_files.set(next,false)
      });
    }
  },

  get_url_credentials: url => {
    // Regular expression to match URLs with embedded credentials
    const regex = /^(https?|git|ssh):\/\/([^\/:@]+(:[^\/:@]+)?@)?([^\/:]+)(:[0-9]+)?(\/.*)?$/;
    // Test the URL against the regular expression
    const match = url.match(regex);
    return match ? (match[2] || '') : '';
  },

  patch_remote: url => {
    return AppProperties.user && url.includes(AppProperties.user.host) && GitService.get_url_credentials(url)===''
      ? `https://oauth2:${AppProperties.user.token.access_token}@${AppProperties.user.host}` + url.split(AppProperties.user.host)[1]
      : url;
  },

  set_git_user: async(name,email)=>{
    let response = null;
    // set git user and email
    response = await window.ipc.invoke('GitService.run', {
      args: [`config`,`--replace-all`,`user.name`,'"'+name+'"'],
      cwd: ArcControlService.props.arc_root
    });
    if(!response[0]) return response;
    response = await window.ipc.invoke('GitService.run', {
      args: [`config`,`--replace-all`,`user.email`,email],
      cwd: ArcControlService.props.arc_root
    });
    return response;
  },

  get_all_lfs_info: async () => {
    const response: string = await window.ipc.invoke('GitService.run', {
      args: [`lfs`, `ls-files`, `-j`],
      cwd: ArcControlService.props.arc_root
    });

    if (!response[0]) {
      console.error('Unable to fetch LFS file list');
      return { files: [] };
    }

    let json: {files: LFSJsonFile[] | null} = JSON.parse(response[1]);

    if (!json.files) {
      json = { files: [] };
    } 

    return json as LFSJsonResponse; 
  },

  get_branches: async () => {
    // does not show branches without commits. So after git init, this will return no branches
    const response = await window.ipc.invoke('GitService.run', {
      args: [`branch`],
      cwd: ArcControlService.props.arc_root
    });
    const branches_raw = response[1].split('\n').slice(0,-1);
    const branches: Branches = {
      list: [],
      current: null
    };
    for(let branch of branches_raw){
      const branch_name = branch.slice(2);
      branches.list.push(branch_name);
      if(branch[0]==='*')
        branches.current = branch_name;
    }
    if (!branches.current) { //if there is no branch, we try `git branch --show-current` which works even without commits
      const [success, branchName]: [boolean, string] = await window.ipc.invoke('GitService.run', {
        args: [`branch`, "--show-current"],
        cwd: ArcControlService.props.arc_root
      });
      const trimmedName = branchName.trim();
      if (success && trimmedName !== '') {
        branches.current = trimmedName;
      }
    }

    GitService._.branches = branches;
    return branches;
  },

  check_remotes: async()=>{
    const branches = await GitService.get_branches();

    const hash_response = await window.ipc.invoke('GitService.run', {
      args: [`rev-parse`,`HEAD`],
      cwd: ArcControlService.props.arc_root
    });
    const latest_local_hash = hash_response[1].trim();

    for(let id in GitService._.remotes){
      const url = GitService.patch_remote(GitService._.remotes[id].url);
      if(AppProperties.user && url.includes(AppProperties.user.host)){
        const fetch_response = await window.ipc.invoke('GitService.run', {
          args: [`ls-remote`,url,`-h`,`refs/heads/${branches.current}`],
          cwd: ArcControlService.props.arc_root
        });
        GitService._.remotes[id].dirty = fetch_response[0] && latest_local_hash!==fetch_response[1].split('\t')[0];
      }
    }
  },

  get_remotes: async()=>{
    const response = await window.ipc.invoke('GitService.run', {
      args: [`remote`,`-v`],
      cwd: ArcControlService.props.arc_root
    });
    GitService._.remotes = {};

    for(let row of response[1].split('\n').slice(0,-1)){
      const row_ = row.split('\t');
      const name = row_[0];
      const url = row_[1].split(' ')[0];

      GitService._.remotes[name] = {
        url: url,
        dirty: false
      };
    }

    return GitService._.remotes;
  },

  init: ()=>{
    watch(()=>GitService._.lfs_size_limit, GitService.select_lfs_nodes);
  }
};

GitService.init();

export default GitService;
