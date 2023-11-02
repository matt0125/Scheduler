import 'dart:convert';
import 'package:http/http.dart' as http;

class APIService {
  final String baseUrl;

  APIService._internal(this.baseUrl); // Private constructor

  // Singleton instance
  static final APIService _instance = APIService._internal('http://large.poosd-project.com/api');

  factory APIService() {
    return _instance;
  }

  Future<Map<String, dynamic>> postToEndpoint(Map<String, dynamic> data, String endpoint) async {
    final response = await http.post(
      Uri.parse('$baseUrl/$endpoint'),
      headers: <String, String>{
        'Content-Type': 'application/json',
      },
      body: json.encode(data),
    );
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Failed to post data to $endpoint');
    }
  }

  Future<bool> login(String username, String password) async {
    final data = {
      'username': username,
      'password': password,
    };

    final responseData = await postToEndpoint(data, 'login');

    if (responseData['message'] == 'Login successful') {
      return true;
    } else {
      return false;
    }
  }

  Future<bool> register(   String firstName, String lastName, String email, String phone, String username, String password,  ) async {
    final data = {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      'username': username,
      'password': password,

    };

    final responseData = await postToEndpoint(data, 'register');

    if (responseData['message'] == 'Account created!') {
      return true;
    } else {
      return false;
    }
  }

}