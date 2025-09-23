import 'package:riverpod_annotation/riverpod_annotation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';

part 'storage_service.g.dart';

@Riverpod(keepAlive: true)
StorageService storageService(StorageServiceRef ref) {
  return StorageService();
}

class StorageService {
  static const _secureStorage = FlutterSecureStorage();
  
  // Box names
  static const String _generalBoxName = 'general_box';
  static const String _userBoxName = 'user_box';
  static const String _cacheBoxName = 'cache_box';
  
  // Hive boxes
  late Box _generalBox;
  late Box _userBox;
  late Box _cacheBox;

  // Initialize the storage service
  Future<void> init() async {
    await Hive.initFlutter();
    _generalBox = await Hive.openBox(_generalBoxName);
    _userBox = await Hive.openBox(_userBoxName);
    _cacheBox = await Hive.openBox(_cacheBoxName);
  }

  // String operations
  Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  Future<bool> setString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.setString(key, value);
  }

  // Integer operations
  Future<int?> getInt(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getInt(key);
  }

  Future<bool> setInt(String key, int value) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.setInt(key, value);
  }

  // Boolean operations
  Future<bool?> getBool(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(key);
  }

  Future<bool> setBool(String key, bool value) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.setBool(key, value);
  }

  // Remove key
  Future<bool> remove(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.remove(key);
  }

  // Clear all
  Future<bool> clear() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.clear();
  }

  // Secure storage operations
  Future<String?> getSecureString(String key) async {
    return await _secureStorage.read(key: key);
  }

  Future<void> setSecureString(String key, String value) async {
    await _secureStorage.write(key: key, value: value);
  }

  Future<void> removeSecureString(String key) async {
    await _secureStorage.delete(key: key);
  }

  Future<void> clearSecureStorage() async {
    await _secureStorage.deleteAll();
  }

  // Hive operations for complex data
  Future<void> putHiveData(String boxName, String key, dynamic value) async {
    Box box;
    switch (boxName) {
      case _generalBoxName:
        box = _generalBox;
        break;
      case _userBoxName:
        box = _userBox;
        break;
      case _cacheBoxName:
        box = _cacheBox;
        break;
      default:
        box = await Hive.openBox(boxName);
    }
    await box.put(key, value);
  }

  dynamic getHiveData(String boxName, String key) {
    Box box;
    switch (boxName) {
      case _generalBoxName:
        box = _generalBox;
        break;
      case _userBoxName:
        box = _userBox;
        break;
      case _cacheBoxName:
        box = _cacheBox;
        break;
      default:
        throw ArgumentError('Box $boxName is not initialized');
    }
    return box.get(key);
  }

  // User specific operations
  Future<void> setUserData(String key, dynamic value) async {
    await _userBox.put(key, value);
  }

  dynamic getUserData(String key) {
    return _userBox.get(key);
  }

  Future<void> clearUserData() async {
    await _userBox.clear();
  }

  // Cache operations with TTL
  Future<void> cacheData(String key, dynamic value, {Duration? ttl}) async {
    final data = {
      'value': value,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'ttl': ttl?.inMilliseconds,
    };
    await _cacheBox.put(key, data);
  }

  dynamic getCachedData(String key) {
    final data = _cacheBox.get(key);
    if (data == null) return null;

    final timestamp = data['timestamp'] as int;
    final ttl = data['ttl'] as int?;

    if (ttl != null) {
      final now = DateTime.now().millisecondsSinceEpoch;
      if (now - timestamp > ttl) {
        _cacheBox.delete(key);
        return null;
      }
    }

    return data['value'];
  }
}