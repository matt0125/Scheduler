import 'package:flutter/material.dart';
import 'package:sched/Services/DataService.dart';
import '../Services/APIService.dart';
import '../Widgets/popup.dart';
import 'availability.dart';
import 'timeoff.dart';



class ProfileTab extends StatefulWidget {
  @override
  _ProfileTabState createState() => _ProfileTabState();
}

class _ProfileTabState extends State<ProfileTab> with AutomaticKeepAliveClientMixin<ProfileTab> {
  final TextEditingController currentPasswordController = TextEditingController();
  final TextEditingController newPasswordController = TextEditingController();
  final TextEditingController confirmNewPasswordController = TextEditingController();
  final apiService = APIService();





  @override
  bool get wantKeepAlive => true;


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
        child: Stack(
          children: <Widget>[
            Container(
              color: Color(0xFFEDE7E3),
              height: MediaQuery.of(context).size.height / 4, // Divide the screen into three parts
            ),
            Positioned(
              top: 25,
              left: MediaQuery.of(context).size.width/2 - 87.5,
              child: Container(
                width: 175,
                height: 175,
                child: Image.asset(
                  'assets/icon/Sched logo.png',
                  fit: BoxFit.contain, // You can adjust BoxFit to your needs
                ),
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                SizedBox(
                  height: MediaQuery.of(context).size.height / 4,
                ),
                Divider(

                ),
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => AvailabilityScreen()),
                    );
                  },
                  child: Text(
                    '  Set Availability  ',
                    style: TextStyle(
                      fontSize: 20,
                    ),
                  ),
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
                  child: Text(
                    'Request Time-off',
                    style: TextStyle(
                      fontSize: 20,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFB1947B),
                  ),
                ),
                ElevatedButton(
                  onPressed: () {
                    _showPasswordUpdateDialog(context);
                  },
                  child: Text(
                    'Update Password',
                    style: TextStyle(
                      fontSize: 20,
                    ),
                  ),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Color(0xFFB1947B),
                  ),
                ),
              ],
            ),
          ],
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

  void _showPasswordUpdateDialog(BuildContext context) async {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setState) {
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
                  onPressed: () async {
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

                    // Check if current password is the same as the new password
                    if (currentPassword == newPassword) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('New password must be different from the current password')),
                      );
                      return;
                    }

                    if (newPassword == confirmNewPassword) {
                      try {
                        // Show loading indicator
                        setState(() {
                          // Set a loading state in your UI
                        });

                        final response = await apiService.updatePassword(
                          currentPassword: currentPassword,
                          newPassword: newPassword,
                        );

                        // Clear text fields
                        currentPasswordController.clear();
                        newPasswordController.clear();
                        confirmNewPasswordController.clear();

                        if (response.empId == null) {
                          // Display success message
                          Navigator.of(context).pop(); // Close the dialog
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Password updated successfully')),
                          );
                        } else {
                          DataService.writeEmpId(response.empId!);
                          DataService.writeJWT(response.token!);

                          // Show the error message
                          Popup(
                            title: 'Error',
                            message: response.message,
                          ).show(context);
                        }
                      } catch (e) {
                        // Handle exceptions
                        print('Error updating password: $e');
                        // Show specific error message to the user
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Current password is incorrect.')),
                        );
                      } finally {
                        // Hide loading indicator
                        setState(() {
                          // Reset the loading state in your UI
                        });
                      }
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Passwords do not match')),
                      );
                    }
                  },
                  child: Text('Update'),
                ),
              ],
            );
          },
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
      validator: (value) {
        print('Validator called for $labelText with value: $value');
        if (value == null || value.isEmpty) {
          return 'Please enter $labelText';
        }
        return null;
      },
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
