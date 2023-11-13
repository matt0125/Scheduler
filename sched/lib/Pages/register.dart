import 'package:flutter/material.dart';
import 'package:sched/Pages/welcome.dart';
import 'package:sched/Services/APIService.dart';
import 'package:sched/Services/DataService.dart';
import 'package:sched/Widgets/popup.dart';
import 'package:flutter/services.dart'; // Import for TextInputFormatter


class SignUpPage extends StatefulWidget {
  const SignUpPage({Key? key}) : super(key: key);

  @override
  _SignUpPageState createState() => _SignUpPageState();
}

class _SignUpPageState extends State<SignUpPage> {
  final TextEditingController firstNameController = TextEditingController();
  final TextEditingController lastNameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController phoneNumberController = TextEditingController();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  bool _obscureText = true;

  final apiService = APIService();

  Map<String, bool> fieldValidation = {
    'firstName': true,
    'lastName': true,
    'email': true,
    'phoneNumber': true,
    'username': true,
    'password': true,
  };

  Future<void> _signUp() async {
    setState(() {
      // Validate each field and update the validation state.
      fieldValidation['firstName'] = firstNameController.text.isNotEmpty;
      fieldValidation['lastName'] = lastNameController.text.isNotEmpty;
      fieldValidation['email'] = emailController.text.isNotEmpty;
      fieldValidation['phoneNumber'] = phoneNumberController.text.isNotEmpty;
      fieldValidation['username'] = usernameController.text.isNotEmpty;
      fieldValidation['password'] = passwordController.text.isNotEmpty;
    });

    // Check if any field is not filled out.
    if (fieldValidation.containsValue(false)) {
      // Display an error message or take action as needed.
      Popup(
        title: 'Error',
        message: 'Please fill out all fields.',
      ).show(context);
    } else {
      final String firstName = firstNameController.text;
      final String lastName = lastNameController.text;
      final String email = emailController.text;
      final String phoneNumber = phoneNumberController.text;
      final String username = usernameController.text;
      final String password = passwordController.text;

      final response = await apiService.register(
        firstName,
        lastName,
        email,
        phoneNumber,
        username,
        password,
      );

      if (response.empId == null) {
        // Display error
        Popup(
          title: 'Error',
          message: response.message,
        ).show(context);
      } else {
        final loginResponse = await apiService.login(
          username,
          password,
        );

        if(loginResponse.empId != null) {
          await DataService.writeEmpId(loginResponse.empId!);
          await DataService.writeJWT(loginResponse.token!);

          Navigator.pushReplacement(context,
              MaterialPageRoute(
                builder: (context) => WelcomePage(),
              )
          );
        }
        else {
          Popup(
            title: 'Error',
            message: loginResponse.message,
          ).show(context);
        }

      }
    }
  }

  void _togglePasswordVisibility() {
    setState(() {
      _obscureText = !_obscureText;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFEDE7E3),
      body: SingleChildScrollView(
        child: Stack(
          children: [
            Container(
              color: Colors.white,
              height: MediaQuery.of(context).size.height / 4,
            ),
            Column(
              children: [
                Padding(
                  padding: const EdgeInsets.all(115),
                  child: Column(
                    children: [
                      const SizedBox(height: 25.0),
                      const SignUpText(),
                      const SizedBox(height: 20.0),
                      BubbleText(
                        labelText: 'First Name',
                        controller: firstNameController,
                        isError: !fieldValidation['firstName']!,
                      ),
                      const SizedBox(height: 10.0),
                      BubbleText(
                        labelText: 'Last Name',
                        controller: lastNameController,
                        isError: !fieldValidation['lastName']!,
                      ),
                      const SizedBox(height: 10.0),
                      BubbleText(
                        labelText: 'Email',
                        controller: emailController,
                        isError: !fieldValidation['email']!,
                      ),
                      const SizedBox(height: 10.0),
                      BubbleText(
                        labelText: 'Phone number',
                        controller: phoneNumberController,
                        isError: !fieldValidation['phoneNumber']!,
                        inputFormatter: [FilteringTextInputFormatter.digitsOnly], // Restrict input to numbers only
                      ),

                      const SizedBox(height: 10.0),
                      BubbleText(
                        labelText: 'Username',
                        controller: usernameController,
                        isError: !fieldValidation['username']!,
                      ),
                      const SizedBox(height: 10.0),
                      BubbleText(
                        labelText: 'Password',
                        controller: passwordController,
                        obscureText: _obscureText,
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureText ? Icons.visibility : Icons.visibility_off,
                            color: Color(0xFF49423E),
                          ),
                          onPressed: _togglePasswordVisibility,
                        ),
                        isError: !fieldValidation['password']!,
                      ),
                      const SizedBox(height: 40.0),
                      ElevatedButton(
                        onPressed: _signUp,
                        style: ButtonStyle(
                          backgroundColor: MaterialStateProperty.all<Color>(const Color(0xFFB1947B)),
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
                              'Sign up',
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
                      const SizedBox(height: 20.0),
                      const AccountText(),
                      LoginButton(),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
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

class SignUpText extends StatelessWidget {
  const SignUpText({Key? key});

  @override
  Widget build(BuildContext context) {
    return const Text(
      'Sign up',
      style: TextStyle(
        fontFamily: 'Katibeh',
        fontSize: 74.0,
        fontWeight: FontWeight.w400,
        color: Color(0xFF49423E),
      ),
    );
  }
}


class BubbleText extends StatelessWidget {
  final String labelText;
  final TextEditingController controller;
  final bool obscureText;
  final Widget? suffixIcon;
  final bool isError;
  final List<TextInputFormatter>? inputFormatter; // Add inputFormatter property

  const BubbleText({
    required this.labelText,
    required this.controller,
    this.obscureText = false,
    this.suffixIcon,
    this.isError = false,
    this.inputFormatter, // Initialize the inputFormatter property
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
          isError: isError,
          inputFormatter: inputFormatter, // Pass the inputFormatter property to BubbleContainer
        ),
      ],
    );
  }
}


class BubbleContainer extends StatelessWidget {
  final TextEditingController controller;
  final bool obscureText;
  final Widget? suffixIcon;
  final bool isError;
  final List<TextInputFormatter>? inputFormatter; // Add inputFormatter property

  const BubbleContainer({
    required this.controller,
    required this.obscureText,
    this.suffixIcon,
    this.isError = false,
    this.inputFormatter, // Initialize the inputFormatter property
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 275,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(60),
        color: const Color(0xFFCDBFB6),
        border: Border.all(
          color: isError ? Colors.red : Colors.black,
          width: 2.0,
        ),
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
        inputFormatters: inputFormatter, // Apply the inputFormatter here
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


class AccountText extends StatelessWidget {
  const AccountText({Key? key});

  @override
  Widget build(BuildContext context) {
    return const Text(
      "Already have an Account?",
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


class LoginButton extends StatelessWidget {
  const LoginButton({super.key});

  @override
  Widget build(BuildContext context) {
    return WillPopScope(
      onWillPop: () async {
        // Handle back button press
        Navigator.pushNamedAndRemoveUntil(
          context,
          '/login',
          ModalRoute.withName('/'),
        );
        return false;
      },
      child: const Text(
        'Log in here',
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
