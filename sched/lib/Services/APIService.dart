import 'dart:convert';
import 'package:intl/intl.dart';
import 'package:http/http.dart' as http;
import 'package:sched/Models/Employee.dart';
import 'package:sched/Models/Shift.dart';
import 'package:sched/Services/DataService.dart';
import '../Models/FullShift.dart';
import '../Models/Position.dart';

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

    List<String> start = startDate.split("-");
    List<String> end = endDate.split("-");

    DateTime sDate = DateTime.parse("${start[2]}-${start[0]}-${start[1]}");
    DateTime eDate = DateTime.parse("${end[2]}-${end[0]}-${end[1]}");
    int numDays = eDate.difference(sDate).inDays;

    List<Shift> shifts = [];

    for(int i = 0; i <= numDays; i++)
      {
        shifts.add(Shift(
            rawDate: sDate.add(Duration(days: i)).toString(),
            isWorking: false)
        );
      }

    final responseData = await postToEndpoint(data, 'shifts/empbydates');

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
      // Find day
      DateTime date = DateTime.parse(item['date']);
      int index = date.difference(sDate).inDays + 1;

      shifts[index] = Shift(
          rawDate: item['date'],
          isWorking: true,
          startTime: item['templateId']['startTime'],
          endTime: item['templateId']['endTime'],
          positionTitle: item['templateId']['positionId']['name']
      );
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

    for (final item in responseData["shifts"]) {
      try {
        shifts.add(FullShift(
          startTime: item['templateId']['startTime'],
          endTime: item['templateId']['endTime'],
          positionTitle: item['templateId']['positionId']['name'],
          firstName: item['empId']['firstName'],
          lastName: item['empId']['lastName'],
        ));
      } catch (e) {
        // Handle the exception, e.g., print an error message or provide a default value.
        print('Error processing item: $e');
      }
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

  Future<Team> GetTeammates( ) async {
    Team team;

    final responseData = await getToEndpoint(null, 'employee/${DataService.readEmpId()}/teammates');

    try{
      if(responseData['message'] != null)
      {
        print(responseData['message']);
      }
    }
    catch(e)
    {
      print(e);
    }

    List<Employee> teammates = [];

    for(final item in responseData["teammates"])
    {
      List<String> positions = [];
      for(final position in item['positions'])
        {
          positions.add(position['name']);
        }
      teammates.add(Employee(
        firstName: item['firstName'],
        lastName: item['lastName'],
        email: item['email'],
        phone: item['phone'],
        positionTitles: positions,
      ));
    }

    List<String> managerPositions = [];
    if (responseData['manager']['positions'] != null)
      {
        for(final position in responseData['manager']['positions'])
        {
          managerPositions.add(position['name']);
        }
      }
    List<String> selfPositions = [];
    if (responseData['employee']['positions'] != null)
    {
      for(final position in responseData['employee']['positions'])
      {
        selfPositions.add(position['name']);
      }
    }

    team = Team(
      teammates: teammates,
      manager: Employee(
        firstName: responseData['manager']['firstName'],
        lastName: responseData['manager']['lastName'],
        email: responseData['manager']['email'],
        phone: responseData['manager']['phone'],
        positionTitles: managerPositions,
      ),
      self: Employee(
        firstName: responseData['employee']['firstName'],
        lastName: responseData['employee']['lastName'],
        email: responseData['employee']['email'],
        phone: responseData['employee']['phone'],
        positionTitles: selfPositions,
      )
    );

    return team;
  }

  Future<List<Employee>> GetAllManagers() async {
    final responseData = await getToEndpoint(null, 'managers');

    if (responseData == null) {
      // Handle the case where responseData is null, e.g., return an empty list
      print('Error: Null response data');
      return [];
    }

    try {
      if (responseData['message'] != null) {
        print(responseData['message']);
      }
    } catch (e) {
      print('Error in message check: $e');
    }

    List<Employee> managers = [];

    if (responseData["managers"] != null) {
      for (final item in responseData["managers"]) {
        List<String> positions = [];
        if (item['positions'] != null) {
          for (final position in item['positions']) {
            positions.add(position['name']);
          }
        }

        managers.add(Employee(
          employeeId: item['_id'],
          firstName: item['firstName'],
          lastName: item['lastName'],
          email: item['email'],
          phone: item['phone'],
          positionTitles: positions,
        ));
      }
    } else {
      print('Error: "managers" key is null or not present in response data');
    }

    return managers;
  }


  Future<Response> AssignManager ( String managerId ) async {
    final data = {
      'managerId': managerId,
    };

    final responseData = await postToEndpoint(data, 'employee/${DataService.readEmpId()}/assign/manager');

    return Response(
      message: responseData['message'],
      success: (responseData['message'] == 'Manager assigned successfully!') ? true: false,
    );
  }

  Future<List<Position>> GetAllPositions () async {
    final responseData = await getToEndpoint(null, 'position');

    try{
      if(responseData['message'] != null)
      {
        print(responseData['message']);
      }
    }
    catch(e)
    {
      print(e);
    }

    List<Position> positions = [];

    for(final item in responseData["positions"])
    {
      positions.add(
        Position(
            id: item['_id'],
            name: item['name']
        )
      );
    }

    return positions;
  }

  Future<List<List<bool>>> GetAvailabilities() async {
    final responseData = await getToEndpoint(null, 'employee/${DataService.readEmpId()}/availabilities');

    return List<List<bool>>.from(responseData['availability'].map((day) => List<bool>.from(day)));
  }

  Future<Response> updateAvailability(List<List<bool>> availability) async {
    final data = {
      'availability': availability,
    };

    final responseData = await putToEndpoint(data, 'employee/${DataService.readEmpId()}/availabilityByArray');

    return Response(
      message: responseData['message'],
      success: (responseData['message'] == 'Availability updated successfully') ? true : false,
    );
  }


}

class Response {
  final String message;
  final String? empId;
  final String? token;
  final bool? success;

  Response({
    required this.message,
    this.empId,
    this.token,
    this.success,
  });
}

