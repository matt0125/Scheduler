import 'package:flutter/material.dart';
import 'package:sched/Pages/passwordCode.dart';

import '../Services/APIService.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: ForgotPasswordPage(),
    );
  }

}



class ForgotPasswordPage extends StatelessWidget {
  final apiService = APIService();
  final TextEditingController emailController = TextEditingController();

  @override
  Widget build(BuildContext context) {

    Color customColor = Color(0xFF49423E);

    return Scaffold(
      backgroundColor: const Color(0xFFEDE7E3),
      body: Stack(
        children: [
          // Top part of the background
          Container(
            color: Colors.white,
            height: MediaQuery.of(context).size.height / 4,
          ),
          SingleChildScrollView(
            child: Column(

              children: [
                // App bar with back arrow
                AppBar(
                  title: Text('Forgot Password'),
                  leading: IconButton(
                    icon: Icon(Icons.arrow_back, color: customColor),
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(
                        context,
                        '/login',
                        ModalRoute.withName('/'),
                      );
                    },
                  ),
                ),
                // Content moved to the bottom part of the background
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(height: 13),
                      SchedLogoImage(),
                      SizedBox(height: 100),
                      Text(
                        'Enter your email to reset password',
                        style: TextStyle(fontSize: 18, color: customColor),
                      ),
                      SizedBox(height: 10),
                      TextField(
                        controller: emailController,
                        decoration: InputDecoration(
                          labelText: 'Email',
                          labelStyle: TextStyle(color: customColor),
                          border: OutlineInputBorder(),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: customColor), // Set the desired highlight color
                          ),
                        ),
                      ),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () async {
                          final response =
                          await apiService.requestPasswordReset(emailController.text);
                          if (response.success! == true) {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) => PasswordCodePage(),
                              ),
                            );
                          } else {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: Text('Error'),
                                  content: Text(
                                      'There was an error sending the password reset email.'),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        Navigator.pop(context); // Close the dialog
                                      },
                                      child: Text('OK'),
                                    ),
                                  ],
                                );
                              },
                            );
                          }
                        },
                        style: ButtonStyle(
                          backgroundColor:
                          MaterialStateProperty.all<Color>(Color(0xFFB1947B)),
                        ),
                        child: Text('Reset Password'),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class SchedLogoImage extends StatelessWidget {
  const SchedLogoImage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,  // Set the desired width
      height: 150, // Set the desired height
      child: Padding(
        padding: const EdgeInsets.only(top: 0), // Adjust the top padding as needed
        // Align the image to the top center
        child: Image.asset(
          'assets/icon/Sched logo.png',
          fit: BoxFit.contain, // You can adjust BoxFit to your needs
        ),
      ),

    );
  }
}

