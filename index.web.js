import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// ── Web Host Bridge Stub — Simulated "Native Module" ────────────────────────
// This is the "Proper" way: the host platform provides the data.
// remote-config-core remains a pure pass-through.
window.RemoteConfigStubModule = {
  getAll: async () => {
    console.log('[Web-Host] Providing stub data to core bridge...');
    return {
      theme_color: '#5afff0', // Distinctive cyan for host-passed web stub
      is_feature_x_enabled: 'true',
    };
  },
};

// Register the app
AppRegistry.registerComponent(appName, () => App);

// Run the app on web
AppRegistry.runApplication(appName, {
  initialProps: {},
  rootTag: document.getElementById('app-root'),
});
