import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../shared/widgets/loading/simple_splash_screen.dart';
import 'app.dart';

/// App wrapper that handles initialization and splash screen
class AppInitializer extends ConsumerStatefulWidget {
  const AppInitializer({super.key});

  @override
  ConsumerState<AppInitializer> createState() => _AppInitializerState();
}

class _AppInitializerState extends ConsumerState<AppInitializer> {
  bool _isInitialized = false;
  bool _showSplash = true;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    // Simulate app initialization tasks
    await Future.wait([
      _loadUserPreferences(),
      _initializeServices(),
      _loadConfiguration(),
      // Add minimum splash screen time (reduced for better UX)
      Future.delayed(const Duration(milliseconds: 800)),
    ]);

    if (mounted) {
      setState(() {
        _isInitialized = true;
      });
      // Trigger splash completion after a small delay to show the completed state
      Future.delayed(const Duration(milliseconds: 300), () {
        if (mounted) {
          _onSplashComplete();
        }
      });
    }
  }

  Future<void> _loadUserPreferences() async {
    // Simulate loading user preferences
    await Future.delayed(const Duration(milliseconds: 100));
  }

  Future<void> _initializeServices() async {
    // Simulate service initialization
    await Future.delayed(const Duration(milliseconds: 150));
  }

  Future<void> _loadConfiguration() async {
    // Simulate configuration loading
    await Future.delayed(const Duration(milliseconds: 50));
  }

  void _onSplashComplete() {
    // Only hide splash if initialization is complete
    if (_isInitialized) {
      setState(() {
        _showSplash = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_showSplash || !_isInitialized) {
      return MaterialApp(
        title: 'HCSub',
        debugShowCheckedModeBanner: false,
        home: SimpleSplashScreen(
          onInitializationComplete: _onSplashComplete,
          appName: 'HCSub',
          version: '1.0.0',
        ),
      );
    }

    return const HCSubApp();
  }
}
