import 'package:shared_preferences/shared_preferences.dart';

class DataService {
  static SharedPreferences? _prefs;

  static void init(SharedPreferences prefs) {
    _prefs = prefs;
  }

  static void _checkPrefsInitialized() {
    if (_prefs == null) {
      throw Exception('SharedPreferences has not been initialized. Call init() first.');
    }
  }

  static Future<void> writeEmpId(String empId) async {
    _checkPrefsInitialized();
    await clearEmpId();
    await _prefs!.setString('empId', empId);
  }

  static String readEmpId() {
    _checkPrefsInitialized();
    return _prefs!.getString('empId').toString();
  }

  static Future<void> clearEmpId() async {
    _checkPrefsInitialized();
    await _prefs!.remove('empId');
  }


  static Future<void> writeJWT(String jwt) async {
    _checkPrefsInitialized();
    await clearJWT();
    await _prefs!.setString('JWT', jwt);
  }

  static String readJWT() {
    _checkPrefsInitialized();
    return _prefs!.getString('JWT').toString();
  }

  static Future<void> clearJWT() async {
    _checkPrefsInitialized();
    await _prefs!.remove('JWT');
  }
}
