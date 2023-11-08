// main.dart
import 'package:flutter/material.dart';
import 'package:sched/tabs.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'Pages/login.dart'; // Import the LoginPage from login.dart
import 'Pages/register.dart'; // Import the SignUpPage from register.dart
import 'package:sched/Pages/welcome.dart';
import 'package:sched/Services/DataService.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  final prefs = await SharedPreferences.getInstance();
  DataService.init(prefs);

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    String initRoute = '/login';


    if(DataService.readEmpId() != "null")
      {
        initRoute = '/';
      }

    return MaterialApp(
      theme: ThemeData(
        appBarTheme: AppBarTheme(
        color: const Color(0xFFEDE7E3),
          titleTextStyle: TextStyle(
            color: Color(0xFF6d6a68),
            fontSize: 20,
          ),
        )),
      initialRoute: initRoute,
      routes: {
        '/': (context) => TabsPage(),
        '/login': (context) => const LoginPage(), // Set the LoginPage as the initial route
        '/signup': (context) => const SignUpPage(), // Define a named route for the SignUpPage
        '/welcome': (context) => WelcomePage(),
      },
    );
  }
}
