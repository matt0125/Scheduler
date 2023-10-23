// main.dart
import 'package:flutter/material.dart';
import 'loginpage.dart'; // Import the LoginPage from loginpage.dart
import 'signup.dart'; // Import the SignUpPage from signup.dart
import 'dashboard.dart'; // Import the DashboardPage from dashboard.dart

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => const LoginPage(), // Set the LoginPage as the initial route
        '/signup': (context) => const SignUpPage(), // Define a named route for the SignUpPage
      },
    );
  }
}
