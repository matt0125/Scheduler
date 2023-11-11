import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:sched/Models/Shift.dart';
import 'package:sched/Services/DataService.dart';
import '../Models/FullShift.dart';

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
        'Authorization': 'Bearer ${DataService.readJWT()}',
      },
      body: json.encode(data),
    );
    try {
      return json.decode(response.body);
    } catch (e) {
      throw Exception('Failed to decode response for $endpoint: $e');
    }
  }

  Future<Map<String, dynamic>> getToEndpoint(Map<String, dynamic>? data, String endpoint) async {
    final response = await http.get(
      Uri.parse('$baseUrl/$endpoint'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${DataService.readJWT()}',
      }
    );
    try {
      return json.decode(response.body);
    } catch (e) {
      throw Exception('Failed to decode response for $endpoint: $e');
    }
  }

  Future<Map<String, dynamic>> putToEndpoint(Map<String, dynamic> data, String endpoint) async {
    final response = await http.put(
      Uri.parse('$baseUrl/$endpoint'),
      headers: <String, String>{
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ${DataService.readJWT()}',
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
        token: responseData['token'],
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

  Future<List<Shift>> GetShiftsByEmpAndDate( String startDate, String endDate ) async {
    final data = {
      'empId': DataService.readEmpId(),
      'startDate': startDate,
      'endDate': endDate,
    };

    List<Shift> shifts = [];

    final responseData = await postToEndpoint(data, 'shifts/empbydates');
    List temp = [];

    try{
      if(responseData['message'] != null)
      {
        print(responseData['message']);
        return shifts;
      }
    }
    catch(e)
    {
      print(e);
    }

    for(final item in responseData["shifts"])
    {
      shifts.add(Shift(
          date: Shift.formatDate(item['date']),
          unformattedDate: Shift.formatDate2(item['date']),
          startTime: item['templateId']['startTime'],
          endTime: item['templateId']['endTime'],
          positionTitle: item['templateId']['positionId']['name']
      ));
    }

    return shifts;
  }

  Future<List<FullShift>> GetShiftsByDate( String date ) async {
    List<String> dates = date.split("-");
    String formattedDate = "${dates[2]}-${dates[0]}-${dates[1]}T00:00:00.000Z";

    List<FullShift> shifts = [];

    final responseData = await getToEndpoint(null, 'shifts/date/${formattedDate}');

    try{
      if(responseData['message'] != null)
      {
        print(responseData['message']);
        return shifts;
      }
    }
    catch(e)
    {
      print(e);
    }

    for(final item in responseData["shifts"])
    {
      shifts.add(FullShift(
          startTime: item['templateId']['startTime'],
          endTime: item['templateId']['endTime'],
          positionTitle: item['templateId']['positionId']['name'],
          firstName: item['empId']['firstName'],
          lastName: item['empId']['lastName'],
      ));
    }

    return shifts;
  }

  Future<Response> updatePassword({required String currentPassword,required String newPassword,}) async {
    final data = {
      'currentPassword': currentPassword,
      'newPassword': newPassword,
    };


      final responseData = await putToEndpoint(data, 'employee/${DataService.readEmpId()}/password');

      // Check if the response body indicates success
      return Response(message: responseData['message'],
          token: responseData['token'],
          empId: (responseData['message'] == 'Password updated successfully')
              ? responseData['id']
              : null);
  }

}

class Response {
  final String message;
  final String? empId;
  final String? token;

  Response({
    required this.message,
    this.empId,
    this.token,
  });
}

