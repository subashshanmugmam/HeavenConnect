import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final String id;
  final String email;
  final String name;
  final String? profilePicture;
  final String? phoneNumber;
  final UserAddress? address;
  final UserPreferences preferences;
  final DateTime createdAt;
  final DateTime updatedAt;

  const User({
    required this.id,
    required this.email,
    required this.name,
    this.profilePicture,
    this.phoneNumber,
    this.address,
    required this.preferences,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);

  User copyWith({
    String? id,
    String? email,
    String? name,
    String? profilePicture,
    String? phoneNumber,
    UserAddress? address,
    UserPreferences? preferences,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      profilePicture: profilePicture ?? this.profilePicture,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      address: address ?? this.address,
      preferences: preferences ?? this.preferences,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}

@JsonSerializable()
class UserAddress {
  final String street;
  final String city;
  final String state;
  final String zipCode;
  final String country;
  final double latitude;
  final double longitude;

  const UserAddress({
    required this.street,
    required this.city,
    required this.state,
    required this.zipCode,
    required this.country,
    required this.latitude,
    required this.longitude,
  });

  factory UserAddress.fromJson(Map<String, dynamic> json) =>
      _$UserAddressFromJson(json);
  Map<String, dynamic> toJson() => _$UserAddressToJson(this);
}

@JsonSerializable()
class UserPreferences {
  final bool notificationsEnabled;
  final bool locationSharingEnabled;
  final bool darkModeEnabled;
  final String language;
  final List<String> interests;

  const UserPreferences({
    required this.notificationsEnabled,
    required this.locationSharingEnabled,
    required this.darkModeEnabled,
    required this.language,
    required this.interests,
  });

  factory UserPreferences.fromJson(Map<String, dynamic> json) =>
      _$UserPreferencesFromJson(json);
  Map<String, dynamic> toJson() => _$UserPreferencesToJson(this);

  static const UserPreferences defaultPreferences = UserPreferences(
    notificationsEnabled: true,
    locationSharingEnabled: false,
    darkModeEnabled: false,
    language: 'en',
    interests: [],
  );
}
