import 'package:flutter/material.dart';
import 'package:sched/Services/DataService.dart';
import 'availability.dart';
import 'timeoff.dart';

class ProfileTab extends StatefulWidget {
  @override
  _ProfileTabState createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> with AutomaticKeepAliveClientMixin<ProfileTab> {
  @override
  bool get wantKeepAlive => true;

  // Define text controllers for the password fields.
  final TextEditingController currentPasswordController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmNewPasswordController = TextEditingController();
  final TextEditingController usernameController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Scaffold(
      appBar: AppBar(
        title: Text('My Profile'),
        automaticallyImplyLeading: false,
        actions: <Widget>[
          IconButton(
            icon: const Icon(Icons.logout),
            color: Color(0xFF6d6a68),
            onPressed: () {
              showLogoutConfirmationDialog(context);
            },
          ),
        ],
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.only(left: 20, top: 10),
          child: Stack(
            children: <Widget>[
              Positioned(
                top: 0,
                left: 0,
                child: Container(
                  width: 100,
                  height: 100,
                  child: Image.asset(
                    'assets/icon/Sched logo.png',
                    fit: BoxFit.contain, // You can adjust BoxFit to your needs
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.only(top: 120),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => AvailabilityScreen()),
                        );
                      },
                      child: Text('Availability'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => TimeOffScreen()),
                        );
                      },
                      child: Text('Time-off'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        _showPasswordUpdateDialog(context);
                      },
                      child: Text('Update Password'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color(0xFFB1947B),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void showLogoutConfirmationDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Leaving so soon?'),
          content: Text('Are you sure you want to log out?'),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Perform logout here
                DataService.clearEmpId();
                DataService.clearJWT();
                Navigator.pushReplacementNamed(
                  context,
                  '/login',
                );
              },
              child: Text('Logout'),
            ),
          ],
        );
      },
    );
  }

  void _showPasswordUpdateDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text('Update Password'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              _buildPasswordTextField(
                controller: currentPasswordController,
                labelText: 'Current Password',
              ),
              _buildPasswordTextField(
                controller: newPasswordController,
                labelText: 'New Password',
              ),
              _buildPasswordTextField(
                controller: confirmNewPasswordController,
                labelText: 'Confirm New Password',
              ),
            ],
          ),
          actions: <Widget>[
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                // Implement password update logic here.
                String currentPassword = currentPasswordController.text;
                String newPassword = newPasswordController.text;
                String confirmNewPassword = confirmNewPasswordController.text;

                if (newPassword == confirmNewPassword) {
                  // Passwords match, update the password.
                  // You can add further validation and update logic here.

                  // Show a success message.
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Password updated successfully'),
                  ));
                } else {
                  // Passwords do not match, show an error message.
                  ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                    content: Text('Passwords do not match'),
                  ));
                }

                Navigator.of(context).pop();
              },
              child: Text('Update'),
            ),
          ],
        );
      },
    );
  }

  Widget _buildPasswordTextField({
    required TextEditingController controller,
    required String labelText,
  }) {
    return TextFormField(
      controller: controller,
      decoration: InputDecoration(
        labelText: labelText,
      ),
    );
  }

  @override
  void dispose() {
    currentPasswordController.dispose();
    newPasswordController.dispose();
    confirmNewPasswordController.dispose();
    super.dispose();
  }
}
