<script lang="ts" setup>

import {onMounted,onUnmounted} from 'vue';
import logoURL from '../../assets/nfdi-hero.svg';
import confetti from 'canvas-confetti';

onMounted(()=>{
  var duration = 10 * 1000;
  var animationEnd = Date.now() + duration;
  var skew = 1;

  function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  (function frame() {
    var timeLeft = animationEnd - Date.now();
    var ticks = Math.max(200, 500 * (timeLeft / duration));
    skew = Math.max(0.8, skew - 0.001);

    confetti({
      particleCount: 1,
      startVelocity: 0,
      ticks: ticks,
      origin: {
        x: Math.random(),
        // since particles fall down, skew start toward the top
        y: (Math.random() * skew) - 0.2
      },
      colors: ['#0bb5dd','#2d3e50'],
      shapes: ['circle', 'square'],
      gravity: randomInRange(0.4, 0.6),
      scalar: randomInRange(0.4, 1),
      drift: randomInRange(-0.4, 0.4)
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  }());
})

</script>

<template>

  <div style="text-align:center;">
    <img :src="logoURL" style="box-sizing:border-box;width:100%;padding:4em;max-width:900px;"/>
    <div class='text-h4'><span style="border-bottom:0.1em solid #000;">Welcome to <b>ARC</b>itect <b>v1.0.0</b>!</span></div>
    <div class='text-h6' style="line-height:1em;padding-top:0.5em;">Democratization of plant research<br>made easy.</div>
  </div>

</template>

