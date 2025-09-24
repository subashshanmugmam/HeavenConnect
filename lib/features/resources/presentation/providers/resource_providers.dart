import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/services/resource_service.dart';
import '../../domain/models/resource_model.dart';

// Service provider
final resourceServiceProvider = Provider<ResourceService>((ref) {
  return ResourceService();
});

// State classes for resources
class ResourcesState {
  final List<ResourceModel> resources;
  final bool isLoading;
  final String? error;
  final String selectedCategory;
  final String searchQuery;
  final String sortBy;

  const ResourcesState({
    required this.resources,
    required this.isLoading,
    this.error,
    required this.selectedCategory,
    required this.searchQuery,
    required this.sortBy,
  });

  ResourcesState copyWith({
    List<ResourceModel>? resources,
    bool? isLoading,
    String? error,
    String? selectedCategory,
    String? searchQuery,
    String? sortBy,
  }) {
    return ResourcesState(
      resources: resources ?? this.resources,
      isLoading: isLoading ?? this.isLoading,
      error: error,
      selectedCategory: selectedCategory ?? this.selectedCategory,
      searchQuery: searchQuery ?? this.searchQuery,
      sortBy: sortBy ?? this.sortBy,
    );
  }
}

class MyResourcesState {
  final List<ResourceModel> resources;
  final bool isLoading;
  final String? error;

  const MyResourcesState({
    required this.resources,
    required this.isLoading,
    this.error,
  });

  MyResourcesState copyWith({
    List<ResourceModel>? resources,
    bool? isLoading,
    String? error,
  }) {
    return MyResourcesState(
      resources: resources ?? this.resources,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

class ResourceRequestsState {
  final List<ResourceRequest> requests;
  final bool isLoading;
  final String? error;

  const ResourceRequestsState({
    required this.requests,
    required this.isLoading,
    this.error,
  });

  ResourceRequestsState copyWith({
    List<ResourceRequest>? requests,
    bool? isLoading,
    String? error,
  }) {
    return ResourceRequestsState(
      requests: requests ?? this.requests,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Resources provider
class ResourcesNotifier extends StateNotifier<ResourcesState> {
  final ResourceService _resourceService;

  ResourcesNotifier(this._resourceService)
      : super(const ResourcesState(
          resources: [],
          isLoading: false,
          selectedCategory: 'All',
          searchQuery: '',
          sortBy: 'newest',
        ));

  Future<void> loadResources({
    bool refresh = false,
    double? latitude,
    double? longitude,
  }) async {
    if (!refresh && state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final resources = await _resourceService.getResources(
        category:
            state.selectedCategory == 'All' ? null : state.selectedCategory,
        search: state.searchQuery.isEmpty ? null : state.searchQuery,
        sortBy: state.sortBy,
        latitude: latitude,
        longitude: longitude,
      );

      state = state.copyWith(
        resources: resources,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  void setCategory(String category) {
    if (state.selectedCategory != category) {
      state = state.copyWith(selectedCategory: category);
      loadResources(refresh: true);
    }
  }

  void setSearchQuery(String query) {
    if (state.searchQuery != query) {
      state = state.copyWith(searchQuery: query);
      if (query.length >= 3 || query.isEmpty) {
        loadResources(refresh: true);
      }
    }
  }

  void setSortBy(String sortBy) {
    if (state.sortBy != sortBy) {
      state = state.copyWith(sortBy: sortBy);
      loadResources(refresh: true);
    }
  }

  Future<void> requestResource({
    required String resourceId,
    required DateTime startDate,
    DateTime? endDate,
    String? message,
  }) async {
    try {
      await _resourceService.requestResource(
        resourceId: resourceId,
        startDate: startDate,
        endDate: endDate,
        message: message,
      );
      // Refresh resources to update availability
      loadResources(refresh: true);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }
}

// My Resources provider
class MyResourcesNotifier extends StateNotifier<MyResourcesState> {
  final ResourceService _resourceService;

  MyResourcesNotifier(this._resourceService)
      : super(const MyResourcesState(
          resources: [],
          isLoading: false,
        ));

  Future<void> loadMyResources() async {
    if (state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final resources = await _resourceService.getMyResources();
      state = state.copyWith(
        resources: resources,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> createResource({
    required String title,
    required String description,
    required String category,
    String? subCategory,
    required String condition,
    required String pricingType,
    double? amount,
    String? period,
    required double latitude,
    required double longitude,
    required String city,
    required String state,
    required String zipCode,
    String? street,
    List<String>? tags,
    List<String>? imagePaths,
    String? brand,
    String? model,
  }) async {
    try {
      final newResource = await _resourceService.createResource(
        title: title,
        description: description,
        category: category,
        subCategory: subCategory,
        condition: condition,
        pricingType: pricingType,
        amount: amount,
        period: period,
        latitude: latitude,
        longitude: longitude,
        city: city,
        state: state,
        zipCode: zipCode,
        street: street,
        tags: tags,
        imagePaths: imagePaths,
        brand: brand,
        model: model,
      );

      // Add to current list
      state = state.copyWith(
        resources: [newResource, ...state.resources],
      );
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> updateResource({
    required String id,
    String? title,
    String? description,
    String? category,
    String? condition,
    double? amount,
    String? status,
    List<String>? tags,
  }) async {
    try {
      final updatedResource = await _resourceService.updateResource(
        id: id,
        title: title,
        description: description,
        category: category,
        condition: condition,
        amount: amount,
        status: status,
        tags: tags,
      );

      // Update in current list
      final updatedResources = state.resources.map((resource) {
        return resource.id == id ? updatedResource : resource;
      }).toList();

      state = state.copyWith(resources: updatedResources);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }

  Future<void> deleteResource(String id) async {
    try {
      await _resourceService.deleteResource(id);

      // Remove from current list
      final updatedResources =
          state.resources.where((resource) => resource.id != id).toList();
      state = state.copyWith(resources: updatedResources);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }
}

// Resource Requests provider
class ResourceRequestsNotifier extends StateNotifier<ResourceRequestsState> {
  final ResourceService _resourceService;

  ResourceRequestsNotifier(this._resourceService)
      : super(const ResourceRequestsState(
          requests: [],
          isLoading: false,
        ));

  Future<void> loadMyRequests() async {
    if (state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final requests = await _resourceService.getMyRequests();
      state = state.copyWith(
        requests: requests,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> loadResourceRequests() async {
    if (state.isLoading) return;

    state = state.copyWith(isLoading: true, error: null);

    try {
      final requests = await _resourceService.getResourceRequests();
      state = state.copyWith(
        requests: requests,
        isLoading: false,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: e.toString(),
      );
    }
  }

  Future<void> respondToRequest({
    required String requestId,
    required String status,
    String? message,
  }) async {
    try {
      await _resourceService.respondToRequest(
        requestId: requestId,
        status: status,
        message: message,
      );

      // Update request in list
      final updatedRequests = state.requests.map((request) {
        if (request.id == requestId) {
          return ResourceRequest(
            id: request.id,
            resourceId: request.resourceId,
            requesterId: request.requesterId,
            requesterName: request.requesterName,
            requesterAvatar: request.requesterAvatar,
            status: status,
            startDate: request.startDate,
            endDate: request.endDate,
            message: request.message,
            totalAmount: request.totalAmount,
            createdAt: request.createdAt,
            resource: request.resource,
          );
        }
        return request;
      }).toList();

      state = state.copyWith(requests: updatedRequests);
    } catch (e) {
      state = state.copyWith(error: e.toString());
      rethrow;
    }
  }
}

// Providers
final resourcesProvider =
    StateNotifierProvider<ResourcesNotifier, ResourcesState>((ref) {
  final resourceService = ref.watch(resourceServiceProvider);
  return ResourcesNotifier(resourceService);
});

final myResourcesProvider =
    StateNotifierProvider<MyResourcesNotifier, MyResourcesState>((ref) {
  final resourceService = ref.watch(resourceServiceProvider);
  return MyResourcesNotifier(resourceService);
});

final resourceRequestsProvider =
    StateNotifierProvider<ResourceRequestsNotifier, ResourceRequestsState>(
        (ref) {
  final resourceService = ref.watch(resourceServiceProvider);
  return ResourceRequestsNotifier(resourceService);
});

// Individual resource provider
final resourceProvider =
    FutureProvider.family<ResourceModel, String>((ref, id) async {
  final resourceService = ref.watch(resourceServiceProvider);
  return await resourceService.getResourceById(id);
});

// Nearby resources provider
final nearbyResourcesProvider = FutureProvider.family<List<ResourceModel>,
    ({double lat, double lng, int radius})>(
  (ref, params) async {
    final resourceService = ref.watch(resourceServiceProvider);
    return await resourceService.getNearbyResources(
      latitude: params.lat,
      longitude: params.lng,
      radius: params.radius,
    );
  },
);
