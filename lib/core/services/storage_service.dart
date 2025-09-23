import 'package:hive_flutter/hive_flutter.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static late SharedPreferences _prefs;
  static late Box<dynamic> _box;

  static const String _boxName = 'hcsub_storage';

  static Future<void> init() async {
    _prefs = await SharedPreferences.getInstance();
    _box = await Hive.openBox(_boxName);
  }

  // Shared Preferences methods
  static Future<bool> setBool(String key, bool value) =>
      _prefs.setBool(key, value);
  static Future<bool> setString(String key, String value) =>
      _prefs.setString(key, value);
  static Future<bool> setInt(String key, int value) =>
      _prefs.setInt(key, value);
  static Future<bool> setDouble(String key, double value) =>
      _prefs.setDouble(key, value);
  static Future<bool> setStringList(String key, List<String> value) =>
      _prefs.setStringList(key, value);

  static bool? getBool(String key) => _prefs.getBool(key);
  static String? getString(String key) => _prefs.getString(key);
  static int? getInt(String key) => _prefs.getInt(key);
  static double? getDouble(String key) => _prefs.getDouble(key);
  static List<String>? getStringList(String key) => _prefs.getStringList(key);

  static Future<bool> remove(String key) => _prefs.remove(key);
  static Future<bool> clear() => _prefs.clear();

  // Hive methods for complex objects
  static Future<void> put(String key, dynamic value) => _box.put(key, value);
  static T? get<T>(String key) => _box.get(key);
  static Future<void> delete(String key) => _box.delete(key);
  static Future<void> clearBox() => _box.clear();
}
