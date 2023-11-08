import 'dart:convert';
import 'package:intl/intl.dart';
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
    try {
      return json.decode(response.body);
    } catch (e) {
      throw Exception('Failed to decode response for $endpoint: $e');
    }
  }

  Future<Response> login(String username, String password) async {
    final data = {
      'username': username,
      'password': password,
    };

    final responseData = await postToEndpoint(data, 'login');

    return Response(message: responseData['message'],
        empId: (responseData['message'] == 'Login successful')
            ? responseData['id']
            : null);
  }

  Future<Response> register(   String firstName, String lastName, String email, String phone, String username, String password ) async {
    final data = {
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      'username': username,
      'password': password,
    };

    final responseData = await postToEndpoint(data, 'register');

    return Response(message: responseData['message'],
        empId: (responseData['message'] == "Employee registered successfully")
            ? responseData['employeeId']
            : null);
  }

  Future<List<Shift>> GetShiftsByDate( String empId, String startDate, String endDate ) async {
    final data = {
      'empId': empId,
      'startDate': startDate,
      'endDate': endDate,
    };

    List<Shift> shifts = [];

    final responseData = await postToEndpoint(data, 'shifts/empbydates');

    for(final item in responseData.values)
      {
        shifts.add(Shift(
          date: Shift.formatDate(item['date']),
          startTime: item['startTime'],
          endTime: item['endTime'],
          positionTitle: item['templateId']['positionId']['name']
        ));
      }

    return shifts;
  }
}

class Response {
  final String message;
  final String? empId;

  Response({
    required this.message,
    this.empId,
  });
}

class Shift {
  final String? date;
  final String? startTime;
  final String? endTime;
  final String? positionTitle;

  Shift({
    this.date,
    this.startTime,
    this.endTime,
    this.positionTitle,
  });

  static String formatDate(String dateString) {
    DateTime date = DateTime.parse(dateString);
    String formattedDate = "${_getMonthName(date.month)} ${date.day}, ${date.year}";
    return formattedDate;
  }

  static String _getMonthName(int month) {
    final months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[month - 1];
  }
}