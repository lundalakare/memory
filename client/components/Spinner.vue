<template>
  <div :class="$style.spinner">
    <div :class="$style.innerGear">
      <b-icon-gear-wide />
    </div>
    <div :class="$style.outerGearPivot">
      <div :class="$style.outerGear">
        <b-icon-gear-fill />
      </div>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" module>
$inner-gear-size: 48px;
$speed: 4s;

$gear-teeth-ratio: 8 / 12;
$gear-size-ratio: 0.65;
$gear-offset: 360deg / 8;
$gear-tolerance: 0.08;

$outer-gear-size: $inner-gear-size * $gear-size-ratio;
$gear-tolerance-space: $outer-gear-size * $gear-tolerance;
$size: $inner-gear-size + $outer-gear-size * 2 - $gear-tolerance-space * 2;

.spinner {
  position: relative;
  width: $size;
  height: $size;
}

.innerGear {
  display: flex;
  position: absolute;
  top: $outer-gear-size - $gear-tolerance-space;
  left: $outer-gear-size - $gear-tolerance-space;
  width: $inner-gear-size;
  height: $inner-gear-size;
  font-size: $inner-gear-size;
}
.outerGearPivot {
  position: absolute;
  top: $inner-gear-size / 2 + $outer-gear-size / 2 - $gear-tolerance-space;
  left: 0;
  transform-origin:
    $outer-gear-size + $inner-gear-size / 2 - $gear-tolerance-space
    $outer-gear-size / 2;
  animation: spin $speed infinite linear;
}
.outerGear {
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  width: $outer-gear-size;
  height: $outer-gear-size;
  font-size: $outer-gear-size;
  transform-origin: $outer-gear-size / 2 $outer-gear-size / 2;
  animation: spin $speed * $gear-teeth-ratio infinite linear;

  > svg {
    top: 0;
  }
}

@keyframes spin {
  from {
    transform: rotate($gear-offset);
  }
  to {
    transform: rotate(360deg + $gear-offset);
  }
}

</style>
