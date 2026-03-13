/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  ActivityIndicator,
  ScrollView,
  Text,
} from 'react-native';
import { useEffect, useState } from 'react';

import {
  initialize,
  RemoteConfigCache,
  AppConfig,
  defaultConfig,
  RC_KEY_THEME_COLOR,
  RC_KEY_FEATURE_X_ENABLED,
  simulateUpdate,
} from './remote-config-core';

// ─── Architecture Layer Definitions ─────────────────────────────────────────

const LAYERS = [
  {
    id: 'firebase',
    label: 'Firebase Remote Config',
    sublabel: 'Google Cloud — Source of truth',
    color: '#FF6F00',
    textColor: '#fff',
  },
  {
    id: 'native',
    label: 'Native Apps  (Android / iOS)',
    sublabel: '@react-native-firebase SDK · getAll()',
    color: '#1565C0',
    textColor: '#fff',
  },
  {
    id: 'bridge',
    label: 'Native Bridge',
    sublabel: 'RN Native Modules — fetchAllConfigs()',
    color: '#283593',
    textColor: '#e8eaf6',
  },
  {
    id: 'core',
    label: 'remote-config-core',
    sublabel: 'initialize() → RemoteConfigCache.setCache()',
    color: '#4A148C',
    textColor: '#e1bee7',
  },
  {
    id: 'feature',
    label: 'Feature Modules',
    sublabel: 'RemoteConfigCache.getBoolean() — no network call',
    color: '#311B92',
    textColor: '#d1c4e9',
  },
  {
    id: 'shared',
    label: 'Shared Code',
    sublabel: 'types · constants · mappers',
    color: '#1B5E20',
    textColor: '#c8e6c9',
  },
];

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      // Step 1: Initial fetch
      await initialize();

      // Step 2: Set initial state
      updateState();

      // Step 3: Subscribe to cache changes (Brownfield Real-Time Updates)
      const unsubscribe = RemoteConfigCache.subscribe(() => {
        console.log('[App] Refreshing UI due to Remote Config update.');
        updateState();
      });

      return () => unsubscribe();
    };

    bootstrap();
  }, []);

  const updateState = () => {
    const themeColor = RemoteConfigCache.getString(
      RC_KEY_THEME_COLOR,
      defaultConfig.themeColor,
    );
    const isFeatureXEnabled = RemoteConfigCache.getBoolean(
      RC_KEY_FEATURE_X_ENABLED,
      defaultConfig.isFeatureXEnabled,
    );
    setConfig({ themeColor, isFeatureXEnabled });
  };

  const handleSimulateUpdate = () => {
    const colors = ['#FF5252', '#448AFF', '#4CAF50', '#FFD740', '#7C4DFF'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    console.log('[App] Triggering simulated update...');
    simulateUpdate(randomColor);
  };

  if (!config) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#7C4DFF" />
        <Text style={styles.loadingText}>Initializing Remote Config…</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {/* ── Header ─────────────────────────── */}
      <Text style={styles.title}>Firebase Remote Config</Text>
      <Text style={styles.subtitle}>Fetch-Once · Cache · Read</Text>

      {/* ── Live Config Values ──────────────── */}
      <View style={[styles.card, { backgroundColor: config.themeColor }]}>
        <Text style={styles.cardTitle}>Live Config Values (from cache)</Text>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Theme Color</Text>
          <Text style={styles.cardValue}>{config.themeColor}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Feature X</Text>
          <Text style={styles.cardValue}>
            {config.isFeatureXEnabled ? 'Enabled ✅' : 'Disabled ❌'}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.cardLabel}>Cache Initialized</Text>
          <Text style={styles.cardValue}>
            {RemoteConfigCache.isInitialized() ? 'Yes ✅' : 'No ❌'}
          </Text>
        </View>

        <View style={styles.simulateContainer}>
          <Text 
            style={styles.simulateButton} 
            onPress={handleSimulateUpdate}
          >
            Simulate Update ⚡️
          </Text>
        </View>
      </View>

      {/* ── Architecture Diagram ────────────── */}
      <Text style={styles.sectionTitle}>Architecture Layers</Text>

      {LAYERS.map((layer, idx) => (
        <View key={layer.id}>
          <View style={[styles.layer, { backgroundColor: layer.color }]}>
            <Text style={[styles.layerLabel, { color: layer.textColor }]}>
              {layer.label}
            </Text>
            <Text style={[styles.layerSub, { color: layer.textColor }]}>
              {layer.sublabel}
            </Text>
          </View>
          {idx < LAYERS.length - 1 && (
            <View style={styles.arrowContainer}>
              <Text style={styles.arrow}>▼</Text>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  container: {
    padding: 20,
    paddingBottom: 48,
    alignItems: 'stretch',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f0f1a',
  },
  loadingText: {
    marginTop: 12,
    color: '#aaa',
    fontSize: 14,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffffcc',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cardLabel: {
    color: '#ffffffaa',
    fontSize: 14,
  },
  cardValue: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  layer: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  layerLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  layerSub: {
    fontSize: 12,
    marginTop: 3,
    opacity: 0.8,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: 3,
  },
  arrow: {
    color: '#555',
    fontSize: 18,
  },
  simulateContainer: {
    marginTop: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ffffff22',
    paddingTop: 16,
  },
  simulateButton: {
    backgroundColor: '#7C4DFF',
    color: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: '700',
    overflow: 'hidden',
  },
});

export default App;
