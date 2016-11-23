class Apps{
  get apps_directory(){
    return [
      "../../apps"
    ];
  }

  apps(){
    return this.apps_directory.
      map(require).
      map(module => module.default);
  }
}

export default Apps;
