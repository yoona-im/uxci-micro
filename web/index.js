window.onload = function () {
  $env.defaultLoader = "web-vue2";
  $env.appPlatform = 256;
  $env.useCrypto = false;
  $env.loaderExtraAssets = {};

  beehive.start({
    triggerMode: "event",
    cssShadowBox: false,
    singular: false,
  });

  $create("/ssdev.ux.WebLoader").then(
    function (loader) {
      loader.on("moduleLoaded", function (m) {
        $event.emit("moduleLoaded", m);
      });
      loader.on("moduleLoadError", function (e) {
        $event.emit("moduleLoadError", e);
        console.error(e);
      });
      loader.init();
    },
    function (e) {
      console.error(e);
      $event.emit("moduleLoadError", e);
    }
  );
};
