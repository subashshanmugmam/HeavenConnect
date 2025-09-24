class ResourceModel {
  final String id;
  final String title;
  final String description;
  final String category;
  final String? subCategory;
  final String condition;
  final String status;
  final String ownerId;
  final String ownerName;
  final String? ownerAvatar;
  final List<String> images;
  final Pricing pricing;
  final Location location;
  final List<String> tags;
  final double? rating;
  final int reviewCount;
  final DateTime createdAt;
  final DateTime updatedAt;
  final bool isAvailable;
  final String? brand;
  final String? model;

  ResourceModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    this.subCategory,
    required this.condition,
    required this.status,
    required this.ownerId,
    required this.ownerName,
    this.ownerAvatar,
    required this.images,
    required this.pricing,
    required this.location,
    required this.tags,
    this.rating,
    required this.reviewCount,
    required this.createdAt,
    required this.updatedAt,
    required this.isAvailable,
    this.brand,
    this.model,
  });

  factory ResourceModel.fromJson(Map<String, dynamic> json) {
    return ResourceModel(
      id: json['_id'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      category: json['category'] ?? '',
      subCategory: json['subCategory'],
      condition: json['condition'] ?? '',
      status: json['status'] ?? '',
      ownerId: json['owner']['_id'] ?? json['owner'] ?? '',
      ownerName: json['owner']['firstName'] != null
          ? '${json['owner']['firstName']} ${json['owner']['lastName'] ?? ''}'
              .trim()
          : json['ownerName'] ?? 'Unknown',
      ownerAvatar: json['owner']['profile']?['avatar']?['url'],
      images: List<String>.from(
          json['images']?.map((img) => img['url'] ?? img) ?? []),
      pricing: Pricing.fromJson(json['pricing'] ?? {}),
      location: Location.fromJson(json['location'] ?? {}),
      tags: List<String>.from(json['tags'] ?? []),
      rating: json['averageRating']?.toDouble(),
      reviewCount: json['reviewCount'] ?? 0,
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      updatedAt:
          DateTime.parse(json['updatedAt'] ?? DateTime.now().toIso8601String()),
      isAvailable: json['status'] == 'available',
      brand: json['brand'],
      model: json['model'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      '_id': id,
      'title': title,
      'description': description,
      'category': category,
      'subCategory': subCategory,
      'condition': condition,
      'status': status,
      'owner': ownerId,
      'ownerName': ownerName,
      'images': images,
      'pricing': pricing.toJson(),
      'location': location.toJson(),
      'tags': tags,
      'averageRating': rating,
      'reviewCount': reviewCount,
      'createdAt': createdAt.toIso8601String(),
      'updatedAt': updatedAt.toIso8601String(),
      'brand': brand,
      'model': model,
    };
  }

  // Get distance string for display
  String getDistanceString() {
    return location.distanceText ?? '0.0 km';
  }

  // Get price string for display
  String getPriceString() {
    if (pricing.type == 'free') return 'Free';
    if (pricing.amount == null || pricing.amount == 0)
      return 'Contact for price';

    final currency = pricing.currency ?? '\$';
    final amount =
        pricing.amount!.toStringAsFixed(pricing.amount! % 1 == 0 ? 0 : 2);
    final period = pricing.period != null ? '/${pricing.period}' : '';

    return '$currency$amount$period';
  }

  // Get category icon
  String getCategoryIcon() {
    switch (category.toLowerCase()) {
      case 'electronics':
        return '📱';
      case 'tools':
        return '🔧';
      case 'furniture':
        return '🪑';
      case 'kitchen':
        return '🍳';
      case 'sports':
        return '⚽';
      case 'garden':
        return '🌱';
      case 'books':
        return '📚';
      case 'vehicles':
        return '🚗';
      default:
        return '📦';
    }
  }
}

class Pricing {
  final String type; // 'free', 'rent', 'sell', 'trade'
  final double? amount;
  final String? currency;
  final String? period; // 'hour', 'day', 'week', 'month'
  final double? deposit;
  final String? tradePreferences;

  Pricing({
    required this.type,
    this.amount,
    this.currency,
    this.period,
    this.deposit,
    this.tradePreferences,
  });

  factory Pricing.fromJson(Map<String, dynamic> json) {
    return Pricing(
      type: json['type'] ?? 'rent',
      amount: json['amount']?.toDouble(),
      currency: json['currency'] ?? '\$',
      period: json['period'],
      deposit: json['deposit']?.toDouble(),
      tradePreferences: json['tradePreferences'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'type': type,
      'amount': amount,
      'currency': currency,
      'period': period,
      'deposit': deposit,
      'tradePreferences': tradePreferences,
    };
  }
}

class Location {
  final List<double> coordinates; // [longitude, latitude]
  final Address? address;
  final String? pickupInstructions;
  final bool isDeliveryAvailable;
  final double? deliveryRadius;
  final double? deliveryFee;
  final double? distance; // Distance from user in km
  final String? distanceText;

  Location({
    required this.coordinates,
    this.address,
    this.pickupInstructions,
    required this.isDeliveryAvailable,
    this.deliveryRadius,
    this.deliveryFee,
    this.distance,
    this.distanceText,
  });

  factory Location.fromJson(Map<String, dynamic> json) {
    final coords = json['coordinates'] != null
        ? List<double>.from(json['coordinates'].map((x) => x.toDouble()))
        : [0.0, 0.0];

    return Location(
      coordinates: coords,
      address:
          json['address'] != null ? Address.fromJson(json['address']) : null,
      pickupInstructions: json['pickupInstructions'],
      isDeliveryAvailable: json['isDeliveryAvailable'] ?? false,
      deliveryRadius: json['deliveryRadius']?.toDouble(),
      deliveryFee: json['deliveryFee']?.toDouble(),
      distance: json['distance']?.toDouble(),
      distanceText: json['distanceText'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'coordinates': coordinates,
      'address': address?.toJson(),
      'pickupInstructions': pickupInstructions,
      'isDeliveryAvailable': isDeliveryAvailable,
      'deliveryRadius': deliveryRadius,
      'deliveryFee': deliveryFee,
    };
  }
}

class Address {
  final String? street;
  final String? city;
  final String? state;
  final String? zipCode;
  final String? country;

  Address({
    this.street,
    this.city,
    this.state,
    this.zipCode,
    this.country,
  });

  factory Address.fromJson(Map<String, dynamic> json) {
    return Address(
      street: json['street'],
      city: json['city'],
      state: json['state'],
      zipCode: json['zipCode'],
      country: json['country'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'street': street,
      'city': city,
      'state': state,
      'zipCode': zipCode,
      'country': country,
    };
  }

  String getFormattedAddress() {
    final parts = <String>[];
    if (street != null && street!.isNotEmpty) parts.add(street!);
    if (city != null && city!.isNotEmpty) parts.add(city!);
    if (state != null && state!.isNotEmpty) parts.add(state!);
    if (zipCode != null && zipCode!.isNotEmpty) parts.add(zipCode!);
    return parts.join(', ');
  }
}

class ResourceRequest {
  final String id;
  final String resourceId;
  final String requesterId;
  final String requesterName;
  final String? requesterAvatar;
  final String status; // 'pending', 'approved', 'rejected', 'completed'
  final DateTime startDate;
  final DateTime? endDate;
  final String? message;
  final double? totalAmount;
  final DateTime createdAt;
  final ResourceModel resource;

  ResourceRequest({
    required this.id,
    required this.resourceId,
    required this.requesterId,
    required this.requesterName,
    this.requesterAvatar,
    required this.status,
    required this.startDate,
    this.endDate,
    this.message,
    this.totalAmount,
    required this.createdAt,
    required this.resource,
  });

  factory ResourceRequest.fromJson(Map<String, dynamic> json) {
    return ResourceRequest(
      id: json['_id'] ?? '',
      resourceId: json['resource']['_id'] ?? json['resourceId'] ?? '',
      requesterId: json['requester']['_id'] ?? json['requesterId'] ?? '',
      requesterName: json['requester']['firstName'] != null
          ? '${json['requester']['firstName']} ${json['requester']['lastName'] ?? ''}'
              .trim()
          : json['requesterName'] ?? 'Unknown',
      requesterAvatar: json['requester']['profile']?['avatar']?['url'],
      status: json['status'] ?? '',
      startDate:
          DateTime.parse(json['startDate'] ?? DateTime.now().toIso8601String()),
      endDate: json['endDate'] != null ? DateTime.parse(json['endDate']) : null,
      message: json['message'],
      totalAmount: json['totalAmount']?.toDouble(),
      createdAt:
          DateTime.parse(json['createdAt'] ?? DateTime.now().toIso8601String()),
      resource: ResourceModel.fromJson(json['resource'] ?? {}),
    );
  }
}
