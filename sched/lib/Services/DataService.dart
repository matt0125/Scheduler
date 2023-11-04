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

  static Future<void> writeEmpId(String? empId) async {
    _checkPrefsInitialized();
    if(empId != null)
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
}
