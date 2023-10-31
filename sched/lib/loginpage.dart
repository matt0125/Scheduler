// loginpage.dart
import 'package:flutter/material.dart';
import 'package:sched/signup.dart';
import 'dashboard.dart';
import 'package:sched/Services/APIService.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  bool _obscureText = true;

  final apiService = APIService();

  Future<void> _login() async {
    final String username = usernameController.text;
    final String password = passwordController.text;
    final response = await apiService.login(username, password);

    if (response) {
      print('Username: $username and password: $password.');
      // Replace the navigation logic here to go to the dashboard page upon successful login.
      Navigator.pushNamedAndRemoveUntil(
          context,
          '/',
          ModalRoute.withName('/')
      );
    } else {
      // Handle authentication failure (e.g., show an error message).
      print('Failed: username: $username and password: $password.');
    }
  }


  void _togglePasswordVisibility() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
        onWillPop: () async {
      // You can add your logic here to prevent going back
      // For example, show a confirmation dialog.
      // Return true to allow back navigation, return false to prevent it.
      return false;
    },
    child: Scaffold(
      backgroundColor: const Color(0xFFEDE7E3), // Change the background color here
      body: SingleChildScrollView(
        child: Stack(
          children: [
          Container(
          color: Colors.white,
          height: MediaQuery.of(context).size.height / 4, // Divide the screen into three parts
        ),
        Column(
          children: [
            // Upper third with a white background
            Padding(
              padding: const EdgeInsets.all(115),
              child: Column(
                children: [
                  Sched(), // Add the "Sched" text
                  const SizedBox(height: 20.0),
                  const LogInText(),
                  BubbleText(
                    labelText: 'Email (or username)',
                    controller: usernameController,
                  ),
                  const SizedBox(height: 10.0),
                  BubbleText(
                    labelText: 'Password',
                    controller: passwordController,
                    obscureText: _obscureText, // Use the obscureText value
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscureText
                            ? Icons.visibility
                            : Icons.visibility_off,
                        color: Color(0xFF49423E),
                      ),
                      onPressed: _togglePasswordVisibility,
                    ),
                  ),
                  const SizedBox(height: 40.0),
                  ElevatedButton(
                    onPressed: _login,
                    style: ButtonStyle(
                      backgroundColor:
                      MaterialStateProperty.all<Color>(const Color(0xFFB1947B)),
                      shape: MaterialStateProperty.all<RoundedRectangleBorder>(
                        RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(60),
                        ),
                      ),
                    ),
                    child: const SizedBox(
                      width: 250,
                      height: 50,
                      child: Center(
                        child: Text(
                          'Login',
                          style: TextStyle(
                            fontFamily: 'Katibeh',
                            fontSize: 25,
                            color: Colors.black,
                            height: 2.5,
                          ),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16.0),
                  const NoAccountText(),
                  SignUpButton(),
                ],
              ),
            ),
          ],
        ),
          ],
        )
      ),
    ),
    );
  }
}

class BubbleText extends StatelessWidget {
  final String labelText;
  final TextEditingController controller;
  final bool obscureText;
  final Widget? suffixIcon;

  const BubbleText({
    required this.labelText,
    required this.controller,
    this.obscureText = false,
    this.suffixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.start,
          children: [
            Text(
              labelText,
              style: const TextStyle(
                fontFamily: 'Katibeh',
                fontSize: 25,
                color: Color(0xFF49423E),
              ),
            ),
          ],
        ),
        BubbleContainer(
          controller: controller,
          obscureText: obscureText,
          suffixIcon: suffixIcon,
        ),
      ],
    );
  }
}

class BubbleContainer extends StatelessWidget {
  final TextEditingController controller;
  final bool obscureText;
  final Widget? suffixIcon;

  const BubbleContainer({
    required this.controller,
    required this.obscureText,
    this.suffixIcon,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 275,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(60),
        color: const Color(0xFFCDBFB6),
        border: Border.all(color: Colors.black, width: 2.0),
        boxShadow: const [
          BoxShadow(
            color: Colors.black,
            offset: Offset(0.0, 1.0),
            blurRadius: 5.0,
            spreadRadius: 1.0,
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        decoration: InputDecoration(
          border: InputBorder.none,
          contentPadding:
          const EdgeInsets.symmetric(vertical: 10.0, horizontal: 20.0),
          hintStyle: const TextStyle(
            fontFamily: 'Katibeh',
            color: Color(0xFF49423E),
          ),
          focusedBorder: InputBorder.none,
          enabledBorder: InputBorder.none,
          suffixIcon: suffixIcon,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

class LogInText extends StatelessWidget {
  const LogInText({Key? key});

  @override
  Widget build(BuildContext context) {
    return const Text(
      'Log-in',
      style: TextStyle(
        fontFamily: 'Katibeh',
        fontSize: 74.0,
        fontWeight: FontWeight.w400,
        color: Color(0xFF49423E),
      ),
    );
  }
}

class NoAccountText extends StatelessWidget {
  const NoAccountText({Key? key});

  @override
  Widget build(BuildContext context) {
    return const Text(
      "Don't have an Account?",
      style: TextStyle(
        fontFamily: 'Katibeh',
        fontSize: 17.0,
        fontWeight: FontWeight.w400,
        height: -0.10,
        color: Color(0xFF49423E),
      ),
    );
  }
}

class Sched extends StatelessWidget {
  const Sched({Key? key});

  @override
  Widget build(BuildContext context) {
    return const Text(
      "Sched",
      style: TextStyle(
        fontFamily: 'Katibeh',
        fontSize: 93,
        fontWeight: FontWeight.w400,
        color: Color(0xFF49423E),
      ),
    );
  }
}

class SignUpButton extends StatelessWidget {
  const SignUpButton({super.key});

  @override
  Widget build(BuildContext context) {
    return TextButton(
      onPressed: () {
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/signup',
          ModalRoute.withName('/')
        );
      },
      child: const Text(
        'Sign Up Here',
        style: TextStyle(
          fontFamily: 'Katibeh',
          fontSize: 17.0,
          fontWeight: FontWeight.w400,
          color: Color(0xFF3995F6),
          height: -1,
          decoration: TextDecoration.underline,
        ),
      ),
    );
  }
}
