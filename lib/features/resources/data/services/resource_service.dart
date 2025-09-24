import 'package:dio/dio.dart';
import '../../../../core/services/api_service.dart';
import '../../domain/models/resource_model.dart';

class ResourceService {
  final ApiService _apiService = ApiService();

  // Get all resources with filters
  Future<List<ResourceModel>> getResources({
    String? category,
    String? search,
    String? sortBy,
    int page = 1,
    int limit = 20,
    double? latitude,
    double? longitude,
    int radius = 10,
  }) async {
    try {
      final queryParams = <String, dynamic>{
        'page': page,
        'limit': limit,
      };

      if (category != null && category != 'All') {
        queryParams['category'] = category.toLowerCase();
      }
      if (search != null && search.isNotEmpty) {
        queryParams['search'] = search;
      }
      if (sortBy != null) {
        queryParams['sortBy'] = sortBy;
      }
      if (latitude != null && longitude != null) {
        queryParams['latitude'] = latitude;
        queryParams['longitude'] = longitude;
        queryParams['radius'] = radius;
      }

      final response =
          await _apiService.get('/resources', queryParameters: queryParams);

      if (response.data['success'] == true) {
        final List<dynamic> resourcesData =
            response.data['data']['resources'] ?? [];
        return resourcesData
            .map((json) => ResourceModel.fromJson(json))
            .toList();
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to fetch resources');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        return []; // No resources found
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch resources: $e');
    }
  }

  // Get resource by ID
  Future<ResourceModel> getResourceById(String id) async {
    try {
      final response = await _apiService.get('/resources/$id');

      if (response.data['success'] == true) {
        return ResourceModel.fromJson(response.data['data']);
      } else {
        throw Exception(response.data['message'] ?? 'Resource not found');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        throw Exception('Resource not found');
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch resource: $e');
    }
  }

  // Create new resource
  Future<ResourceModel> createResource({
    required String title,
    required String description,
    required String category,
    String? subCategory,
    required String condition,
    required String pricingType, // 'free', 'rent', 'sell', 'trade'
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
      FormData formData = FormData.fromMap({
        'title': title,
        'description': description,
        'category': category.toLowerCase(),
        'condition': condition,
        'pricing': {
          'type': pricingType,
          'amount': amount,
          'currency': 'USD',
          'period': period,
        },
        'location': {
          'coordinates': [longitude, latitude],
          'address': {
            'street': street,
            'city': city,
            'state': state,
            'zipCode': zipCode,
            'country': 'US',
          },
        },
        if (subCategory != null) 'subCategory': subCategory,
        if (tags != null) 'tags': tags,
        if (brand != null) 'brand': brand,
        if (model != null) 'model': model,
      });

      // Add images if provided
      if (imagePaths != null) {
        for (int i = 0; i < imagePaths.length; i++) {
          formData.files.add(MapEntry(
            'images',
            await MultipartFile.fromFile(imagePaths[i]),
          ));
        }
      }

      final response = await _apiService.upload('/resources', formData);

      if (response.data['success'] == true) {
        return ResourceModel.fromJson(response.data['data']);
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to create resource');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to create resource: $e');
    }
  }

  // Update resource
  Future<ResourceModel> updateResource({
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
      final data = <String, dynamic>{};

      if (title != null) data['title'] = title;
      if (description != null) data['description'] = description;
      if (category != null) data['category'] = category.toLowerCase();
      if (condition != null) data['condition'] = condition;
      if (amount != null) data['pricing'] = {'amount': amount};
      if (status != null) data['status'] = status;
      if (tags != null) data['tags'] = tags;

      final response = await _apiService.put('/resources/$id', data: data);

      if (response.data['success'] == true) {
        return ResourceModel.fromJson(response.data['data']);
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to update resource');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to update resource: $e');
    }
  }

  // Delete resource
  Future<void> deleteResource(String id) async {
    try {
      final response = await _apiService.delete('/resources/$id');

      if (response.data['success'] != true) {
        throw Exception(
            response.data['message'] ?? 'Failed to delete resource');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to delete resource: $e');
    }
  }

  // Get user's own resources
  Future<List<ResourceModel>> getMyResources() async {
    try {
      final response = await _apiService.get('/resources/my-resources');

      if (response.data['success'] == true) {
        final List<dynamic> resourcesData = response.data['data'] ?? [];
        return resourcesData
            .map((json) => ResourceModel.fromJson(json))
            .toList();
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to fetch my resources');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        return []; // No resources found
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch my resources: $e');
    }
  }

  // Request a resource
  Future<void> requestResource({
    required String resourceId,
    required DateTime startDate,
    DateTime? endDate,
    String? message,
  }) async {
    try {
      final data = {
        'resourceId': resourceId,
        'startDate': startDate.toIso8601String(),
        'message': message,
      };

      if (endDate != null) {
        data['endDate'] = endDate.toIso8601String();
      }

      final response = await _apiService.post('/resources/request', data: data);

      if (response.data['success'] != true) {
        throw Exception(
            response.data['message'] ?? 'Failed to request resource');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to request resource: $e');
    }
  }

  // Get resource requests (for resource owner)
  Future<List<ResourceRequest>> getResourceRequests() async {
    try {
      final response = await _apiService.get('/resources/requests');

      if (response.data['success'] == true) {
        final List<dynamic> requestsData = response.data['data'] ?? [];
        return requestsData
            .map((json) => ResourceRequest.fromJson(json))
            .toList();
      } else {
        throw Exception(response.data['message'] ?? 'Failed to fetch requests');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        return []; // No requests found
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch requests: $e');
    }
  }

  // Get my resource requests (requests I made)
  Future<List<ResourceRequest>> getMyRequests() async {
    try {
      final response = await _apiService.get('/resources/my-requests');

      if (response.data['success'] == true) {
        final List<dynamic> requestsData = response.data['data'] ?? [];
        return requestsData
            .map((json) => ResourceRequest.fromJson(json))
            .toList();
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to fetch my requests');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        return []; // No requests found
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch my requests: $e');
    }
  }

  // Respond to resource request
  Future<void> respondToRequest({
    required String requestId,
    required String status, // 'approved' or 'rejected'
    String? message,
  }) async {
    try {
      final data = {
        'status': status,
        'message': message,
      };

      final response =
          await _apiService.put('/resources/requests/$requestId', data: data);

      if (response.data['success'] != true) {
        throw Exception(
            response.data['message'] ?? 'Failed to respond to request');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to respond to request: $e');
    }
  }

  // Get nearby resources
  Future<List<ResourceModel>> getNearbyResources({
    required double latitude,
    required double longitude,
    int radius = 10,
    int limit = 20,
  }) async {
    try {
      final queryParams = {
        'latitude': latitude,
        'longitude': longitude,
        'radius': radius,
        'limit': limit,
        'sortBy': 'distance',
      };

      final response = await _apiService.get('/resources/nearby',
          queryParameters: queryParams);

      if (response.data['success'] == true) {
        final List<dynamic> resourcesData = response.data['data'] ?? [];
        return resourcesData
            .map((json) => ResourceModel.fromJson(json))
            .toList();
      } else {
        throw Exception(
            response.data['message'] ?? 'Failed to fetch nearby resources');
      }
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        return []; // No resources found
      }
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to fetch nearby resources: $e');
    }
  }

  // Add to favorites
  Future<void> addToFavorites(String resourceId) async {
    try {
      final response =
          await _apiService.post('/resources/$resourceId/favorite');

      if (response.data['success'] != true) {
        throw Exception(
            response.data['message'] ?? 'Failed to add to favorites');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to add to favorites: $e');
    }
  }

  // Remove from favorites
  Future<void> removeFromFavorites(String resourceId) async {
    try {
      final response =
          await _apiService.delete('/resources/$resourceId/favorite');

      if (response.data['success'] != true) {
        throw Exception(
            response.data['message'] ?? 'Failed to remove from favorites');
      }
    } on DioException catch (e) {
      throw Exception('Network error: ${e.message}');
    } catch (e) {
      throw Exception('Failed to remove from favorites: $e');
    }
  }
}
