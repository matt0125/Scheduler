// ProfileTab.dart

import 'package:flutter/material.dart';
import 'updatePassword.dart'; // Import the new Dart file
import '../Services/DataService.dart';
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
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (context) => UpdatePasswordScreen()),
                    );
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


  @override
  void dispose() {
    currentPasswordController.dispose();
    newPasswordController.dispose();
    confirmNewPasswordController.dispose();
    super.dispose();
  }
}
