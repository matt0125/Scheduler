import 'package:flutter/material.dart';
import 'package:sched/Pages/login.dart';
import 'package:sched/Pages/register.dart';

import '../Services/APIService.dart';

class PasswordCodePage extends StatefulWidget {
  @override
  _PasswordCodePageState createState() => _PasswordCodePageState();
}

class _PasswordCodePageState extends State<PasswordCodePage> {
  final apiService = APIService();
  final TextEditingController codeController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();

  bool isPasswordTyped = false;

  // Password requirements
  bool isLengthMet = false;
  bool hasUppercase = false;
  bool hasNumber = false;
  bool hasSpecialChar = false;

  @override
  Widget build(BuildContext context) {
    Color customColor = Color(0xFF49423E);

    return WillPopScope(

      onWillPop: () async {
        // You can add your logic here to prevent going back
        // For example, show a confirmation dialog.
        // Return true to allow back navigation, return false to prevent it.
        return false;},
        child: Scaffold(
      backgroundColor: const Color(0xFFEDE7E3),
          body: SingleChildScrollView(
            child: Stack(
              children: [
              Container(
              color: Colors.white,
              height: MediaQuery.of(context).size.height / 4, // Divide the screen into three parts
            ),
            Column(
              children: [
                // App bar with back arrow
                AppBar(
                  title: Text('Password Code'),
                  leading: IconButton(
                    icon: Icon(Icons.arrow_back, color: customColor),
                    onPressed: () {
                      Navigator.pushNamedAndRemoveUntil(
                        context,
                        '/forgotPassword',
                        ModalRoute.withName('/'),
                      );
                    },
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      SizedBox(height: 45),
                      SchedLogoImage(),
                      SizedBox(height: 5),
                      Text(
                        'Enter the code sent to your email',
                        style: TextStyle(fontSize: 18),
                      ),
                      SizedBox(height: 20),
                      TextFormField(
                        controller: codeController,
                        maxLength: 40,
                        decoration: InputDecoration(
                          labelText: 'Verification Code',
                          border: OutlineInputBorder(),
                          labelStyle: TextStyle(color: customColor),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: customColor),
                          ),
                        ),
                      ),
                      Text(
                        'Enter your new password',
                        style: TextStyle(fontSize: 18),
                      ),
                      SizedBox(height: 20),
                      TextFormField(
                        controller: newPasswordController,
                        maxLength: 40,
                        onChanged: (value) {
                          setState(() {
                            // Set isPasswordTyped to true when the user starts typing in the password field
                            isPasswordTyped = value.isNotEmpty;
                            // Update password requirements
                            _updatePasswordRequirements(value);
                          });
                        },
                        decoration: InputDecoration(
                          labelText: 'New Password',
                          border: OutlineInputBorder(),
                          labelStyle: TextStyle(color: customColor),
                          focusedBorder: OutlineInputBorder(
                            borderSide: BorderSide(color: customColor),
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
                      if (isPasswordTyped)
                        PasswordRequirements(
                          isLengthMet: isLengthMet,
                          hasUppercase: hasUppercase,
                          hasNumber: hasNumber,
                          hasSpecialChar: hasSpecialChar,
                        ),
                      SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () async {
                          // Add your code verification logic here
                          String enteredCode = codeController.text;
                          final response =
                          await apiService.resetPassword(newPasswordController.text, codeController.text);
                          // Verify the entered code with the code sent to the user's email

                          // If the code is valid, navigate to the password reset screen
                          if (response.success! == true) {
                            Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                builder: (context) => LoginPage(),
                              ),
                            );
                          } else {
                            showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: Text('Error'),
                                  content: Text(response.message),
                                  actions: [
                                    TextButton(
                                      onPressed: () {
                                        Navigator.pop(context);
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
                          backgroundColor: MaterialStateProperty.all<Color>(Color(0xFFB1947B)),
                        ),
                        child: Text('Submit Code'),
                      ),
                    ],
                  ),
                ),
              ],
            ),

        ],
      ),
        ),
        ));
  }

  // Update password requirements based on the current password
  void _updatePasswordRequirements(String password) {
    setState(() {
      isLengthMet = password.length >= 8;
      hasUppercase = RegExp(r'[A-Z]').hasMatch(password);
      hasNumber = RegExp(r'\d').hasMatch(password);
      hasSpecialChar = RegExp(r'[!@#$%^&*(),.?":{}|<>]').hasMatch(password);
    });
  }
}

class PasswordRequirements extends StatelessWidget {
  final bool isLengthMet;
  final bool hasUppercase;
  final bool hasNumber;
  final bool hasSpecialChar;

  PasswordRequirements({
    required this.isLengthMet,
    required this.hasUppercase,
    required this.hasNumber,
    required this.hasSpecialChar,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Password Requirements:',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20,
            color: Color(0xFF49423E),
            fontWeight: FontWeight.bold,
          ),
        ),
        Text(
          '- At least 8 characters',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20, // Adjust the font size as needed
            color: isLengthMet ? Colors.green : Colors.red,
          ),
        ),
        Text(
          '- Include at least one uppercase letter',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20, // Adjust the font size as needed
            color: hasUppercase ? Colors.green : Colors.red,
          ),
        ),
        Text(
          '- Include at least one number',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20, // Adjust the font size as needed
            color: hasNumber ? Colors.green : Colors.red,
          ),
        ),
        Text(
          '- Include at least one special character',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 25, // Adjust the font size as needed
            color: hasSpecialChar ? Colors.green : Colors.red,
          ),
        ),
      ],
    );
  }
}

class SchedLogoImage extends StatelessWidget {
  const SchedLogoImage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 150,
      height: 150,
      child: Padding(
        padding: const EdgeInsets.only(top: 0),
        child: Image.asset(
          'assets/icon/Sched logo.png',
          fit: BoxFit.contain,
        ),
      ),
    );
  }
}

void main() {
  runApp(MaterialApp(
    home: PasswordCodePage(),
  ));
}
