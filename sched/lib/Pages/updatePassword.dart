// UpdatePasswordPage.dart

import 'package:flutter/material.dart';
import 'package:sched/Pages/profile.dart';
import '../Services/APIService.dart';
import '../Widgets/popup.dart';
import '../tabs.dart';

class UpdatePasswordScreen extends StatefulWidget {
  @override
  _UpdatePasswordScreenState createState() => _UpdatePasswordScreenState();
}

class _UpdatePasswordScreenState extends State<UpdatePasswordScreen> {
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
      body: Center(
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
                ),
                SizedBox(height: 16.0),
                _buildPasswordTextField(
                  controller: newPasswordController,
                  labelText: 'New Password',
                ),
                SizedBox(height: 16.0),
                _buildPasswordTextField(
                  controller: confirmNewPasswordController,
                  labelText: 'Confirm New Password',
                ),
                SizedBox(height: 16.0),
                ElevatedButton(
                  onPressed: () async {
                    // Add your update password logic here
                    final String currentPassword = currentPasswordController.text;
                    final String newPassword = newPasswordController.text;
                    final String confirmNewPassword = confirmNewPasswordController.text;

                    // Check if all fields are filled out
                    if (currentPassword.isEmpty || newPassword.isEmpty || confirmNewPassword.isEmpty) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Please fill out all fields')),
                      );
                      return;
                    }

                    // Check if the current password is the same as the new password
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

                        // Clear text fields
                        // currentPasswordController.clear();
                        // newPasswordController.clear();
                        // confirmNewPasswordController.clear();

                        if (response.empId == null) {
                          Popup(
                            title: 'Error',
                            message: response.message,
                          ).show(context);
                          // Display success message
                          //Navigator.pop(context); // Close the page
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Password updated successfully')),
                          );
                        } else {
                          // Show the error message
                          Popup(
                            title: 'Error',
                            message: response.message,
                          ).show(context);
                        }
                      } catch (e) {
                        // Handle exceptions
                        print('Error updating password: $e');
                        // Show a specific error message to the user
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
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPasswordTextField({
    required TextEditingController controller,
    required String labelText,
  }) {
    return Container(
      width: 300.0,
      height: 53,
      child: TextFormField(
        controller: controller,
        obscureText: false,
        decoration: InputDecoration(
          labelText: labelText,
          border: OutlineInputBorder(),
          labelStyle: TextStyle(color: customColor),
          focusedBorder: OutlineInputBorder(
            borderSide: BorderSide(color: customColor),
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
}
