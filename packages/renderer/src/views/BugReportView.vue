<script lang="ts" setup>

import ViewItem from '../components/ViewItem.vue';

</script>
<template>
  <q-list>
    <ViewItem icon="support_agent" label="Bugs & Support" caption="Found an issue or need support? Let us know!">
      <q-item clickable tag="a" href="https://github.com/nfdi4plants/ARCitect/issues/new/choose" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="bug_report" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>GitHub Issue</q-item-label>
          <q-item-label caption>
            Report a bug or request a feature on GitHub
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" href="https://matrix.to/#/#arc-user-support:matrix.org" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="chat" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>ARC User Support Chat</q-item-label>
          <q-item-label caption>
            Chat live with data stewards on matrix
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" href="https://nfdi4plants.github.io/events/arc-user-support/" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="event" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>User Support Meetings</q-item-label>
          <q-item-label caption>
            Join our regular user support meetings
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" href="mailto:arc-user-support-join@lists.nfdi.de?subject=subscribe&body=Hit send on this email to join the ARC user support mailing list" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="email" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Mailing List</q-item-label>
          <q-item-label caption>
            Join our mailing list for updates and news
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" href="https://helpdesk.nfdi4plants.org/?topic=ToolsandServices_ARCitect" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="support_agent" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Helpdesk</q-item-label>
          <q-item-label caption>
            Submit a ticket to the helpdesk
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>


      <q-item clickable tag="a" href="https://nfdi4plants.github.io/support/" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="help_outline" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>More Support</q-item-label>
          <q-item-label caption>
            Visit our support page to find more options
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>

      <q-item clickable tag="a" href="https://nfdi4plants.org/nfdi4plants.knowledgebase/" target="_blank" v-ripple>
        <q-item-section avatar>
          <q-icon name="menu_book" color="primary" />
        </q-item-section>
        <q-item-section>
          <q-item-label>Knowledge Base</q-item-label>
          <q-item-label caption>
            Visit our Knowledge Base for guides and more
          </q-item-label>
        </q-item-section>
        <q-item-section side>
          <q-icon name="open_in_new" />
        </q-item-section>
      </q-item>

    </ViewItem>
  </q-list>
</template>
