# Community Resource Sharing Platform - Flutter Development Prompt for GitHub Copilot Pro Sonnet 4

## Project Context
Build a comprehensive **Flutter mobile application** for an innovative community resource sharing platform that connects neighbors through AI-powered IoT integration, enabling local rental of items, space sharing, service requests, and food sharing with real-time community interaction.

## 🎯 Core Innovation Requirements
Create a **revolutionary and user-centric** Flutter application featuring:
- **Real-time IoT camera feed integration** with live object detection overlay
- **Interactive neighborhood maps** with dynamic resource visualization
- **AI-powered smart recommendations** with personalized user interfaces
- **Cross-platform compatibility** (iOS, Android, Web, Desktop)
- **Real-time chat and notifications** with WebSocket integration
- **AR item preview** using ARCore/ARKit integration
- **Voice command support** with speech recognition
- **Dynamic pricing displays** with market trend visualization
- **Community trust visualization** with interactive reputation systems
- **Offline-first architecture** with local data persistence

## 📋 Technical Architecture

### Technology Stack
```dart
// Framework: Flutter 3.16+ with Dart 3.2+
// State Management: Riverpod + Riverpod Generator
// Database: Hive (local) + Isar (complex queries)
// HTTP: Dio + Retrofit for API calls
// WebSocket: Socket.io Client Dart
// Maps: Google Maps Flutter + Mapbox Maps
// Authentication: Firebase Auth + JWT
// File Storage: Firebase Storage + Local Storage
// Push Notifications: Firebase Messaging
// Camera/AR: Camera Plugin + AR Flutter Plugin
// Charts: FL Chart + SyncFusion Charts
// Animation: Rive + Lottie Flutter
// Image Processing: Image Picker + Image Cropper
// Geolocation: Geolocator + Geocoding
// Local Storage: Shared Preferences + Secure Storage
```

### Project Structure
```
lib/
├── main.dart
├── app/
│   ├── app.dart (Main app configuration)
│   ├── routes/ (App routing with Go Router)
│   ├── theme/ (App theming and design system)
│   └── constants/ (App constants and configurations)
├── core/
│   ├── network/ (API clients and interceptors)
│   ├── storage/ (Local database and cache)
│   ├── utils/ (Helper functions and extensions)
│   ├── exceptions/ (Custom exception handling)
│   └── services/ (Core services - location, camera, etc.)
├── features/
│   ├── authentication/
│   │   ├── data/ (repositories, data sources, models)
│   │   ├── domain/ (entities, use cases, repository interfaces)
│   │   └── presentation/ (pages, widgets, providers)
│   ├── dashboard/
│   ├── resources/
│   ├── services_marketplace/
│   ├── spaces/
│   ├── food_sharing/
│   ├── chat/
│   ├── iot_integration/
│   ├── maps/
│   ├── payments/
│   ├── community/
│   └── profile/
├── shared/
│   ├── widgets/ (Reusable UI components)
│   ├── extensions/ (Dart extensions)
│   ├── models/ (Shared data models)
│   └── providers/ (Global providers)
└── generated/ (Code generation outputs)

assets/
├── images/
├── icons/
├── animations/ (Lottie and Rive files)
├── fonts/
└── config/
```

## 🚀 Required Features & Screens

### 1. Advanced Authentication & Onboarding
```dart
// Create comprehensive auth system with modern UX
// Features: Social login, biometric auth, phone verification
// Smart onboarding with community discovery
// Location-based community joining

// Key screens and widgets to build:
// - SplashScreen with animated logo
// - OnboardingScreen with PageView and smooth animations
// - LoginScreen with social auth buttons and biometric option
// - RegisterScreen with step-by-step form validation
// - PhoneVerificationScreen with OTP input
// - LocationPermissionScreen with custom animations
// - CommunitySelectionScreen with nearby community discovery
// - ProfileSetupScreen with image upload and preferences
// - BiometricSetupScreen for enhanced security
```

### 2. Interactive Dashboard & Analytics
```dart
// Create dynamic, personalized dashboard
// AI-powered insights and recommendations
// Real-time community activity feed
// Resource utilization analytics with interactive charts

// Key screens and widgets to build:
// - DashboardScreen with customizable widgets
// - StatsCard with animated counters
// - ActivityFeedWidget with pull-to-refresh
// - RecommendationCard with AI suggestions
// - QuickActionsGrid with voice command integration
// - CommunityInsightsChart with FL Chart
// - EcoImpactWidget with gamified progress
// - NotificationBadge with real-time updates
// - WeatherWidget with location-based data
// - TrendingResourcesCarousel with horizontal scroll
```

### 3. Revolutionary Resource Discovery & Management
```dart
// Advanced search with AI-powered filtering
// Visual item recognition and comparison
// Dynamic availability tracking with real-time updates
// Smart pricing suggestions with market analysis

// Key screens and widgets to build:
// - ResourceDiscoveryScreen with search and filters
// - ResourceGrid with staggered grid view and lazy loading
// - ResourceCard with hero animations and quick actions
// - ResourceDetailsScreen with image carousel and AR preview
// - AddResourceScreen with step-by-step wizard
// - ResourceFormWidget with AI-assisted categorization
// - PriceCalculatorWidget with dynamic pricing
// - AvailabilityCalendar with custom calendar widget
// - ResourceComparison with side-by-side comparison
// - WishlistScreen with drag-to-reorder functionality
// - CameraSearchWidget for visual item recognition
```

### 4. Interactive Community Maps
```dart
// Real-time resource mapping with custom markers
// Heat maps for demand and availability
// Route optimization for pickup/delivery
// Geofenced notifications and community boundaries

// Key screens and widgets to build:
// - MapScreen with Google Maps integration
// - CustomMapMarker with resource type indicators
// - MapFiltersBottomSheet with category toggles
// - ResourceClusterMarker for grouped items
// - RouteOptimizationOverlay with pickup planning
// - GeofenceManagerScreen with custom polygon drawing
// - HeatMapOverlay for demand visualization
// - NearbyResourcesList with distance calculations
// - MapLegendWidget with interactive controls
// - LocationPickerDialog with search functionality
```

### 5. IoT Camera Integration & Smart Home Features
```dart
// Live camera feeds with object detection overlay
// Real-time item recognition with bounding boxes
// Smart notifications based on detected objects
// Device management with status monitoring

// Key screens and widgets to build:
// - IoTDashboardScreen with device grid
// - CameraFeedWidget with WebRTC streaming
// - ObjectDetectionOverlay with custom painting
// - DeviceCard with status indicators and controls
// - DeviceSetupScreen with QR code scanning
// - NotificationSettingsScreen with granular controls
// - DetectionHistoryScreen with searchable list
// - SmartAlertDialog with AI-generated messages
// - InventorySyncWidget with automatic updates
// - PrivacyControlsScreen with toggle switches
```

### 6. Advanced Booking & Rental System
```dart
// Smart booking with conflict resolution
// Dynamic pricing with real-time adjustments
// Digital contracts with e-signature support
// Damage assessment with image comparison

// Key screens and widgets to build:
// - BookingScreen with calendar integration
// - BookingFormWidget with smart validation
// - ConflictResolutionDialog with alternatives
// - PricingBreakdownWidget with animated totals
// - DigitalContractScreen with signature pad
// - BookingTimelineWidget with progress indicators
// - DamageAssessmentScreen with before/after photos
// - RatingReviewWidget with star ratings
// - BookingHistoryScreen with status filters
// - RescheduleDialog with smart suggestions
```

### 7. Service Marketplace & Provider Management
```dart
// Skill-based matching with compatibility scoring
// Service provider profiles with rich media
// Real-time booking with instant confirmation
// Performance analytics for providers

// Key screens and widgets to build:
// - ServiceMarketplaceScreen with category grid
// - ProviderProfileScreen with tabbed content
// - ServiceBookingWidget with time slot selection
// - SkillMatchingCard with compatibility scores
// - ProviderVerificationScreen with document upload
// - ServiceReviewsWidget with detailed feedback
// - PerformanceMetricsScreen with chart visualizations
// - AvailabilityManagerScreen with calendar sync
// - ServiceCategoriesGrid with search functionality
// - ProviderDashboard with business insights
```

### 8. Revolutionary Chat & Communication Hub
```dart
// Real-time messaging with rich media support
// Group chats with role-based permissions
// Voice/video calls with WebRTC integration
// AI-powered language translation

// Key screens and widgets to build:
// - ChatListScreen with recent conversations
// - ChatScreen with message bubbles and animations
// - MessageInputWidget with file attachment support
// - VoiceCallScreen with WebRTC integration
// - VideoCallScreen with camera controls
// - GroupChatScreen with participant management
// - ChatSettingsScreen with notification controls
// - LanguageTranslatorWidget with real-time translation
// - FilePreviewDialog with multiple formats support
// - ChatSearchScreen with message history
```

### 9. Advanced Payment & Wallet System
```dart
// Multiple payment methods with Stripe integration
// Digital wallet with transaction history
// Escrow system for secure high-value transactions
// Community credits and reward system

// Key screens and widgets to build:
// - PaymentScreen with Stripe payment sheet
// - WalletScreen with balance and transaction history
// - PaymentMethodsScreen with card management
// - TransactionDetailsScreen with receipt generation
// - EscrowManagerScreen with milestone tracking
// - RefundScreen with dispute handling
// - CommunityCreditsScreen with earning history
// - SubscriptionScreen for premium features
// - FinancialAnalyticsScreen with spending insights
// - InvoiceScreen with PDF generation
```

### 10. Space & Storage Management
```dart
// 3D space visualization with measurement tools
// Storage optimization with AR integration
// Access control with digital key management
// Usage analytics with optimization suggestions

// Key screens and widgets to build:
// - SpaceListScreen with grid and list views
// - SpaceDetailsScreen with 3D visualization
// - SpaceBookingScreen with availability calendar
// - MeasurementToolScreen with AR integration
// - AccessControlScreen with digital keys
// - StorageOptimizerWidget with packing suggestions
// - UsageAnalyticsScreen with utilization metrics
// - SecurityMonitoringScreen with alert system
// - MaintenanceScreen with scheduling functionality
// - PricingOptimizer with market-based suggestions
```

### 11. Food Sharing Network
```dart
// Food safety tracking with expiry management
// Dietary preference matching system
// Community meal coordination
// Waste reduction with gamification

// Key screens and widgets to build:
// - FoodSharingScreen with category filters
// - FoodItemCard with expiry countdown
// - SafetyTrackerWidget with color-coded status
// - DietaryPreferencesScreen with tag selection
// - CommunityMealScreen with event coordination
// - ExpiryAlertsScreen with notification management
// - WasteReductionScreen with impact visualization
// - RecipeSharingScreen with community recipes
// - NutritionalInfoScreen with detailed analysis
// - FoodRequestScreen with matching functionality
```

### 12. Community Features & Social Network
```dart
// Neighborhood activity feeds with real-time updates
// Community events with RSVP functionality
// Trust network with interactive visualization
// Achievement system with progress tracking

// Key screens and widgets to build:
// - CommunityFeedScreen with infinite scroll
// - EventScreen with calendar integration and RSVP
// - TrustNetworkScreen with network visualization
// - AchievementScreen with progress indicators
// - CommunityGoalsScreen with collective targets
// - VolunteerScreen with opportunity matching
// - NeighborhoodNewsScreen with local updates
// - SocialVerificationScreen with neighbor confirmation
// - CommunityPollsScreen with voting functionality
// - ImpactDashboard with metrics visualization
```

## 🎨 UI/UX Design Requirements

### Design System & Theme
```dart
// Implement comprehensive design system
// Material Design 3 with custom theming
// Dark/light mode with system preference detection
// Accessibility compliance (WCAG 2.1 AA)
// Custom color palette with community branding

// Design tokens to implement:
class AppTheme {
  static const ColorScheme lightColorScheme = ColorScheme(...);
  static const ColorScheme darkColorScheme = ColorScheme(...);
  static const TextTheme textTheme = TextTheme(...);
  static const AppBarTheme appBarTheme = AppBarTheme(...);
  // Custom design tokens for spacing, shadows, animations
}
```

### Animation & Interactions
```dart
// Implement smooth animations and micro-interactions
// - Hero animations for seamless navigation
// - Custom page transitions with shared elements
// - Loading animations with skeleton screens
// - Gesture-based interactions (swipe, pinch, drag)
// - Haptic feedback for tactile responses
// - Particle animations for achievements
// - Morphing animations for state changes
```

## 🛡️ Security & Performance Requirements

### Security Features
```dart
// Implement comprehensive security measures
// - Biometric authentication with local_auth
// - Secure token storage with flutter_secure_storage
// - Certificate pinning for API calls
// - Data encryption for sensitive information
// - Privacy controls for location and camera access
// - Secure file handling and validation
```

### Performance Optimization
```dart
// Advanced performance optimizations
// - Image caching with cached_network_image
// - Lazy loading for large lists with AutomaticKeepAliveClientMixin
// - Memory management with proper dispose methods
// - Bundle size optimization with deferred loading
// - Network optimization with request caching
// - Battery optimization with background task management
```

## 📦 Required Dependencies

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # State Management
  riverpod: ^2.4.9
  riverpod_generator: ^2.3.9
  riverpod_annotation: ^2.3.3
  flutter_riverpod: ^2.4.9
  
  # Navigation
  go_router: ^12.1.3
  
  # Network & API
  dio: ^5.4.0
  retrofit: ^4.0.3
  json_annotation: ^4.8.1
  
  # WebSocket
  socket_io_client: ^2.0.3+1
  
  # Database & Storage
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  isar: ^3.1.0+1
  isar_flutter_libs: ^3.1.0+1
  shared_preferences: ^2.2.2
  flutter_secure_storage: ^9.0.0
  
  # UI & Animation
  lottie: ^2.7.0
  rive: ^0.11.4
  animations: ^2.0.8
  shimmer: ^3.0.0
  flutter_staggered_grid_view: ^0.7.0
  
  # Maps & Location
  google_maps_flutter: ^2.5.0
  geolocator: ^10.1.0
  geocoding: ^2.1.1
  
  # Camera & Media
  camera: ^0.10.5+5
  image_picker: ^1.0.4
  image_cropper: ^5.0.1
  cached_network_image: ^3.3.0
  
  # Charts & Visualization
  fl_chart: ^0.65.0
  syncfusion_flutter_charts: ^23.2.7
  
  # Authentication & Firebase
  firebase_core: ^2.24.2
  firebase_auth: ^4.15.3
  firebase_messaging: ^14.7.10
  firebase_storage: ^11.5.6
  local_auth: ^2.1.7
  
  # Payment
  stripe_flutter: ^9.4.0+1
  
  # Forms & Validation
  reactive_forms: ^16.1.1
  
  # Utils
  intl: ^0.18.1
  uuid: ^4.2.2
  url_launcher: ^6.2.2
  share_plus: ^7.2.1
  connectivity_plus: ^5.0.2
  device_info_plus: ^9.1.1
  package_info_plus: ^4.2.0
  
  # AR & Computer Vision
  arcore_flutter_plugin: ^0.0.9
  arkit_plugin: ^0.13.0
  
  # Speech & Audio
  speech_to_text: ^6.6.0
  flutter_tts: ^3.8.3
  
  # Background Tasks
  workmanager: ^0.5.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  
  # Code Generation
  build_runner: ^2.4.7
  riverpod_generator: ^2.3.9
  json_serializable: ^6.7.1
  retrofit_generator: ^8.0.4
  hive_generator: ^2.0.1
  isar_generator: ^3.1.0+1
  
  # Linting
  flutter_lints: ^3.0.1
  very_good_analysis: ^5.1.0
  
  # Testing
  mockito: ^5.4.4
  integration_test:
    sdk: flutter
```

## 🔧 Implementation Guidelines

### 1. Project Setup & Architecture
```dart
// Initialize Flutter project with proper folder structure
// Set up code generation with build_runner
// Configure multiple flavors (development, staging, production)
// Implement clean architecture principles
// Set up dependency injection with Riverpod
```

### 2. State Management with Riverpod
```dart
// Implement comprehensive state management
@riverpod
class AuthNotifier extends _$AuthNotifier {
  @override
  AuthState build() => const AuthState.initial();
  
  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    try {
      final user = await _authRepository.login(email, password);
      state = AuthState.authenticated(user);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }
}

// Create providers for all features
// Implement proper error handling and loading states
// Use code generation for boilerplate reduction
```

### 3. Navigation & Routing
```dart
// Set up declarative routing with GoRouter
final appRouter = GoRouter(
  initialLocation: '/splash',
  routes: [
    GoRoute(
      path: '/splash',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/onboarding',
      builder: (context, state) => const OnboardingScreen(),
    ),
    // Implement nested routes for complex navigation
    ShellRoute(
      builder: (context, state, child) => MainNavigationShell(child: child),
      routes: [
        GoRoute(path: '/dashboard', builder: (context, state) => const DashboardScreen()),
        GoRoute(path: '/resources', builder: (context, state) => const ResourceScreen()),
        // Add all main app routes
      ],
    ),
  ],
);
```

### 4. API Integration & Networking
```dart
// Set up Retrofit for type-safe API calls
@RestApi(baseUrl: 'https://api.communityresource.com/')
abstract class ApiService {
  factory ApiService(Dio dio, {String baseUrl}) = _ApiService;

  @GET('/resources')
  Future<List<Resource>> getResources(@Queries() Map<String, dynamic> filters);

  @POST('/resources')
  Future<Resource> createResource(@Body() CreateResourceRequest request);
}

// Implement proper error handling and retry logic
// Add request/response interceptors for authentication
// Set up caching for offline functionality
```

### 5. Real-time Features with WebSocket
```dart
// Implement WebSocket integration for real-time updates
class SocketService {
  late IO.Socket socket;
  
  void connect() {
    socket = IO.io('ws://api.communityresource.com', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false,
    });
    
    socket.connect();
    socket.on('resource_updated', (data) {
      // Handle real-time resource updates
    });
  }
}
```

## 🎯 Unique Innovation Features to Implement

### 1. AI-Powered Smart Interface
```dart
// Implement cutting-edge AI features:
// - Voice command integration with speech_to_text
// - Smart search with natural language processing
// - Predictive text and auto-suggestions
// - Context-aware recommendations
// - Intelligent camera-based item recognition
```

### 2. Augmented Reality Integration
```dart
// Create immersive AR experiences:
class ARPreviewScreen extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      body: Stack(
        children: [
          ARKitSceneView(
            onARKitViewCreated: (controller) {
              // Implement AR item visualization
              // Add 3D models for size comparison
              // Enable gesture controls for item manipulation
            },
          ),
          // Add AR controls and information overlay
        ],
      ),
    );
  }
}
```

### 3. Advanced Camera & IoT Integration
```dart
// Build sophisticated camera integration:
class SmartCameraWidget extends StatefulWidget {
  @override
  Widget build(BuildContext context) {
    return Stack(
      children: [
        Camera(
          onImageCaptured: (image) async {
            // Process image with TensorFlow Lite
            // Detect objects and extract metadata
            // Sync with backend for inventory updates
          },
        ),
        CustomPaint(
          painter: ObjectDetectionPainter(), // Draw bounding boxes
        ),
      ],
    );
  }
}
```

### 4. Gamification & Social Features
```dart
// Create engaging community features:
class AchievementSystem extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Column(
      children: [
        AnimatedProgressIndicator(), // Progress with animations
        AchievementGrid(), // Grid of unlockable achievements
        CommunityLeaderboard(), // Competitive elements
        ImpactVisualization(), // Environmental impact tracking
      ],
    );
  }
}
```

## 📱 Cross-Platform Considerations

### Platform-Specific Features
```dart
// Implement platform-specific optimizations
class PlatformService {
  static bool get isIOS => Platform.isIOS;
  static bool get isAndroid => Platform.isAndroid;
  
  // iOS-specific features
  void setupiOSNotifications() {
    // Configure iOS push notifications
  }
  
  // Android-specific features
  void setupAndroidNotifications() {
    // Configure Android push notifications
  }
}
```

### Responsive Design
```dart
// Create responsive layouts for different screen sizes
class ResponsiveLayout extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        if (constraints.maxWidth > 1200) {
          return DesktopLayout();
        } else if (constraints.maxWidth > 800) {
          return TabletLayout();
        } else {
          return MobileLayout();
        }
      },
    );
  }
}
```

## 🧪 Testing & Quality Assurance

### Testing Strategy
```dart
// Comprehensive testing approach
void main() {
  group('Authentication Tests', () {
    testWidgets('Login form validation', (tester) async {
      await tester.pumpWidget(MyApp());
      // Test UI interactions and state changes
    });
    
    test('Auth repository tests', () async {
      // Test business logic and API interactions
    });
  });
  
  // Integration tests for user flows
  // Golden tests for UI consistency
  // Performance tests for smooth animations
}
```

## 🚀 Deployment & DevOps

### Build Configuration
```dart
// Configure multiple build flavors
flutter build apk --flavor production --target lib/main_production.dart
flutter build ios --flavor production --target lib/main_production.dart
flutter build web --target lib/main_web.dart
```

### CI/CD Pipeline
```yaml
# GitHub Actions workflow
name: Build and Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: subosito/flutter-action@v2
      - run: flutter test
      - run: flutter build apk --debug
```

## 📋 Development Phases & Success Criteria

### Phase 1: Foundation (Week 1-2)
- ✅ Project setup with clean architecture
- ✅ Authentication system with biometric support
- ✅ Basic navigation with GoRouter
- ✅ State management with Riverpod
- ✅ Design system implementation

### Phase 2: Core Features (Week 3-4)
- ✅ Resource discovery and management
- ✅ Interactive maps with Google Maps
- ✅ Real-time chat system
- ✅ Camera integration with object detection
- ✅ Payment system with Stripe

### Phase 3: Advanced Features (Week 5-6)
- ✅ IoT device integration
- ✅ AR visualization features
- ✅ WebSocket real-time updates
- ✅ Advanced search and filtering
- ✅ Community features and gamification

### Phase 4: Polish & Deployment (Week 7-8)
- ✅ Performance optimization
- ✅ Offline functionality
- ✅ Platform-specific optimizations
- ✅ Testing and quality assurance
- ✅ App store deployment preparation

## 🎯 Success Metrics
- **Performance**: 60fps animations with minimal jank
- **User Experience**: Intuitive navigation with gesture support
- **Cross-platform**: Consistent experience across iOS and Android
- **Offline Support**: Core functionality available without internet
- **Battery Efficiency**: Optimized background processing
- **App Size**: <50MB APK/IPA size
- **Code Quality**: >80% test coverage with null safety

Generate a cutting-edge, production-ready Flutter application that will establish this platform as the **most innovative and user-friendly community resource sharing mobile app** globally, featuring revolutionary AI integration, real-time collaboration, and immersive user experiences that set new standards in the sharing economy mobile applications.