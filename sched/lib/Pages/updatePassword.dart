import 'package:flutter/material.dart';
import '../Services/APIService.dart';
import '../Widgets/popup.dart';

bool isPasswordTyped = false;
bool _currentPasswordObscureText = true;
bool _newPasswordObscureText = true;
bool _confirmNewPasswordObscureText = true;

class UpdatePasswordScreen extends StatefulWidget {
  @override
  _UpdatePasswordScreenState createState() => _UpdatePasswordScreenState();
}

class _UpdatePasswordScreenState extends State<UpdatePasswordScreen> {
  bool isLengthMet = false;
  bool hasUppercase = false;
  bool hasNumber = false;
  bool hasSpecialChar = false;

  final TextEditingController currentPasswordController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmNewPasswordController = TextEditingController();
  final apiService = APIService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Update Password'),
        iconTheme: IconThemeData(
          color: Color(0xFF49423E),
        ),
      ),
      body: SingleChildScrollView(
        child: Center(
          child: Stack(
            children: <Widget>[
              Container(
                color: Color(0xFFEDE7E3),
                height: MediaQuery.of(context).size.height / 4,
              ),
              Positioned(
                top: 25,
                left: MediaQuery.of(context).size.width / 2 - 87.5,
                child: Container(
                  width: 175,
                  height: 175,
                  child: Image.asset(
                    'assets/icon/Sched logo.png',
                    fit: BoxFit.contain,
                  ),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  SizedBox(
                    height: MediaQuery.of(context).size.height / 4,
                  ),
                  Divider(),
                  _buildPasswordTextField(
                    controller: currentPasswordController,
                    labelText: 'Current Password',
                    obscureText: _currentPasswordObscureText,
                    togglePasswordVisibility: () {
                      setState(() {
                        _currentPasswordObscureText = !_currentPasswordObscureText;
                      });
                    }, onChanged: (value) {  },
                  ),
                  SizedBox(height: 16.0),
                  _buildPasswordTextField(
                    controller: newPasswordController,
                    labelText: 'New Password',
                    obscureText: _newPasswordObscureText,
                    onChanged: (value) {
                      setState(() {
                        // Set isPasswordTyped to true when the user starts typing in the password field
                        isPasswordTyped = value.isNotEmpty;
                        // Update password requirements
                        _updatePasswordRequirements(value);
                      });
                    },
                    togglePasswordVisibility: () {
                      setState(() {
                        _newPasswordObscureText = !_newPasswordObscureText;
                      });
                    },
                  ),
                  if (isPasswordTyped)
                    PasswordRequirements(
                      isLengthMet: isLengthMet,
                      hasUppercase: hasUppercase,
                      hasNumber: hasNumber,
                      hasSpecialChar: hasSpecialChar,
                    ),
                  SizedBox(height: 16.0),
                  _buildPasswordTextField(
                    controller: confirmNewPasswordController,
                    labelText: 'Confirm New Password',
                    obscureText: _confirmNewPasswordObscureText,
                    togglePasswordVisibility: () {
                      setState(() {
                        _confirmNewPasswordObscureText = !_confirmNewPasswordObscureText;
                      });
                    }, onChanged: (value) {  },
                  ),
                  SizedBox(height: 16.0),
                  ElevatedButton(
                    onPressed: () async {
                      final String currentPassword = currentPasswordController.text;
                      final String newPassword = newPasswordController.text;
                      final String confirmNewPassword = confirmNewPasswordController.text;

                      if (currentPassword.isEmpty || newPassword.isEmpty || confirmNewPassword.isEmpty) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Please fill out all fields')),
                        );
                        return;
                      }

                      if (currentPassword == newPassword) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('New password must be different from the current password')),
                        );
                        return;
                      }

                      if (newPassword == confirmNewPassword) {
                        try {
                          final response = await apiService.updatePassword(
                            currentPassword: currentPassword,
                            newPassword: newPassword,
                          );

                          if (response.empId == null) {
                            Popup(
                              title: 'Success!',
                              message: response.message,
                            ).show(context);
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(content: Text('Password updated successfully')),
                            );
                          } else {
                            Popup(
                              title: 'Error',
                              message: response.message,
                            ).show(context);
                          }
                        } catch (e) {
                          print('Error updating password: $e');
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Current password is incorrect.')),
                          );
                        }
                      } else {
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Passwords do not match')),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Color(0xFFB1947B),
                    ),
                    child: Text('Update'),
                  ),
                  SizedBox(height: 16.0),
                  PasswordRequirements(
                    isLengthMet: isLengthMet,
                    hasUppercase: hasUppercase,
                    hasNumber: hasNumber,
                    hasSpecialChar: hasSpecialChar,
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordTextField({
    required TextEditingController controller,
    required String labelText,
    required bool obscureText,
    required Function() togglePasswordVisibility, required Null Function(dynamic value) onChanged,
  }) {
    return Container(
      width: 300.0,
      height: 53,
      child: TextFormField(
        controller: controller,
        obscureText: obscureText,
        decoration: InputDecoration(
          labelText: labelText,
          border: OutlineInputBorder(),
          labelStyle: TextStyle(color: customColor),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: customColor),
          ),
          suffixIcon: IconButton(
            icon: Icon(
              obscureText ? Icons.visibility : Icons.visibility_off,
              color: customColor,
            ),
            onPressed: togglePasswordVisibility,
          ),
        ),
        validator: (value) {
          if (value == null || value.isEmpty) {
            return 'Please enter $labelText';
          }
          return null;
        },
      ),
    );
  }

  Color customColor = Color(0xFF49423E);

  @override
  void dispose() {
    currentPasswordController.dispose();
    newPasswordController.dispose();
    confirmNewPasswordController.dispose();
    super.dispose();
  }

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
            fontSize: 20,
            color: Color(0xFF49423E),
          ),
        ),
        Text(
          '- Include at least one uppercase letter',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20,
            color: Color(0xFF49423E),
          ),
        ),
        Text(
          '- Include at least one number',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20,
            color: Color(0xFF49423E),
          ),
        ),
        Text(
          '- Include at least one special character',
          style: TextStyle(
            fontFamily: 'Katibeh',
            fontSize: 20,
            color: Color(0xFF49423E),
          ),
        ),
      ],
    );
  }
}
