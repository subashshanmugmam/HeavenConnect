import 'package:riverpod_annotation/riverpod_annotation.dart';
import '../models/user_model.dart';
import '../../core/storage/storage_service.dart';

part 'app_providers.g.dart';

// App State Provider
@Riverpod(keepAlive: true)
class AppState extends _$AppState {
  @override
  AppStateModel build() {
    return const AppStateModel();
  }

  void setLoading(bool isLoading) {
    state = state.copyWith(isLoading: isLoading);
  }

  void setOnboardingCompleted(bool completed) {
    state = state.copyWith(isOnboardingCompleted: completed);
    if (completed) {
      _saveOnboardingStatus();
    }
  }

  void _saveOnboardingStatus() async {
    final storage = ref.read(storageServiceProvider);
    await storage.setBool('onboarding_completed', true);
  }
}

// Authentication State Provider
@Riverpod(keepAlive: true)
class AuthenticationState extends _$AuthenticationState {
  @override
  AuthStateModel build() {
    _checkAuthStatus();
    return const AuthStateModel();
  }

  void _checkAuthStatus() async {
    final storage = ref.read(storageServiceProvider);
    final token = await storage.getString('auth_token');
    final isOnboardingCompleted = await storage.getBool('onboarding_completed') ?? false;
    
    state = state.copyWith(
      isAuthenticated: token != null,
      isOnboardingCompleted: isOnboardingCompleted,
      isLoading: false,
    );
  }

  void setAuthenticated(bool isAuthenticated, {UserModel? user}) {
    state = state.copyWith(
      isAuthenticated: isAuthenticated,
      user: user,
    );
  }

  void setUser(UserModel user) {
    state = state.copyWith(user: user);
  }

  void logout() async {
    final storage = ref.read(storageServiceProvider);
    await storage.remove('auth_token');
    await storage.remove('refresh_token');
    await storage.remove('user_data');
    
    state = state.copyWith(
      isAuthenticated: false,
      user: null,
    );
  }
}

// Location State Provider
@Riverpod(keepAlive: true)
class LocationState extends _$LocationState {
  @override
  LocationStateModel build() {
    return const LocationStateModel();
  }

  void updateLocation(double latitude, double longitude) {
    state = state.copyWith(
      latitude: latitude,
      longitude: longitude,
      hasLocation: true,
    );
  }

  void setLocationPermission(bool hasPermission) {
    state = state.copyWith(hasLocationPermission: hasPermission);
  }
}

// Connectivity State Provider
@Riverpod(keepAlive: true)
class ConnectivityState extends _$ConnectivityState {
  @override
  bool build() {
    return true; // Assume connected initially
  }

  void setConnectivity(bool isConnected) {
    state = isConnected;
  }
}

// Models for state management
class AppStateModel {
  final bool isLoading;
  final bool isOnboardingCompleted;
  final String? errorMessage;

  const AppStateModel({
    this.isLoading = false,
    this.isOnboardingCompleted = false,
    this.errorMessage,
  });

  AppStateModel copyWith({
    bool? isLoading,
    bool? isOnboardingCompleted,
    String? errorMessage,
  }) {
    return AppStateModel(
      isLoading: isLoading ?? this.isLoading,
      isOnboardingCompleted: isOnboardingCompleted ?? this.isOnboardingCompleted,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class AuthStateModel {
  final bool isAuthenticated;
  final bool isLoading;
  final bool isOnboardingCompleted;
  final UserModel? user;
  final String? errorMessage;

  const AuthStateModel({
    this.isAuthenticated = false,
    this.isLoading = true,
    this.isOnboardingCompleted = false,
    this.user,
    this.errorMessage,
  });

  AuthStateModel copyWith({
    bool? isAuthenticated,
    bool? isLoading,
    bool? isOnboardingCompleted,
    UserModel? user,
    String? errorMessage,
  }) {
    return AuthStateModel(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      isLoading: isLoading ?? this.isLoading,
      isOnboardingCompleted: isOnboardingCompleted ?? this.isOnboardingCompleted,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }
}

class LocationStateModel {
  final double? latitude;
  final double? longitude;
  final bool hasLocation;
  final bool hasLocationPermission;

  const LocationStateModel({
    this.latitude,
    this.longitude,
    this.hasLocation = false,
    this.hasLocationPermission = false,
  });

  LocationStateModel copyWith({
    double? latitude,
    double? longitude,
    bool? hasLocation,
    bool? hasLocationPermission,
  }) {
    return LocationStateModel(
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      hasLocation: hasLocation ?? this.hasLocation,
      hasLocationPermission: hasLocationPermission ?? this.hasLocationPermission,
    );
  }
}