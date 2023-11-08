import 'package:flutter/material.dart';
import 'Pages/dashboard.dart';
import 'Pages/team.dart';
import 'Pages/profile.dart';

class TabsPage extends StatefulWidget {
  @override
  _TabsPageState createState() => _TabsPageState();
}

class _TabsPageState extends State<TabsPage> {
  int _currentIndex = 0;

  final List<Widget> _tabs = [
    DashboardPage(),
    TeamTab(),
    ProfileTab(),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
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
    child:Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        showSelectedLabels: true, // Hide labels for selected items
        showUnselectedLabels: false, // Hide labels for unselected items

        backgroundColor: Color(0xFFEDE7E3),
        selectedItemColor: Color(0xFF6d6a68),
        unselectedItemColor: Color(0xFF6d6a68),
        // Color(0xFFEDE7E3)


        onTap: _onTabTapped,
        items: [
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month),
            label: 'Dashboard',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.group),
            label: 'Team',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
      ),
    ),
    );
  }
}
