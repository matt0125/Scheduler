import 'package:flutter/material.dart';
import '../Models/Employee.dart';
import '../Services/APIService.dart';

class TeamTab extends StatefulWidget {
  @override
  _TeamTabState createState() => _TeamTabState();
}

class _TeamTabState extends State<TeamTab> {
  bool _isLoading = true;
  final api = APIService();
  late Team _team;

  @override
  void initState() {
    getShifts();
  }

  void getShifts() async {
    _team = await api.GetTeammates();
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Team'),
        automaticallyImplyLeading: false,
      ),
      body: (_isLoading
          ? Center(child: CircularProgressIndicator())
          : ListView.builder(
        itemCount: _team.teammates.length + 1,
        itemBuilder: (context, index) {
          Employee coworker;
          bool isManager = false;
          if (index == 0) {
            coworker = _team.manager;
            isManager = true;
          } else {
            coworker = _team.teammates[index - 1];
          }

          return Column(
            children: [
              ListTile(
                title: Text(
                  coworker.fullName,
                  style: TextStyle(
                      fontWeight:
                      isManager ? FontWeight.bold : FontWeight.normal),
                ),
                trailing: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        SizedBox(height: 12),
                        Text(
                          coworker.email,
                          style: TextStyle(
                              fontWeight: isManager
                                  ? FontWeight.bold
                                  : FontWeight.normal),
                        ),
                        // Add spacing here
                        Text(
                          coworker.phone,
                          style: TextStyle(
                              fontWeight: isManager
                                  ? FontWeight.bold
                                  : FontWeight.normal),
                        ),
                      ],
                    ),
                  ],
                ),
                subtitle: Text(
                  coworker.positionTitles.join(', '),
                  style: TextStyle(
                      fontWeight:
                      isManager ? FontWeight.bold : FontWeight.normal),
                ), // Display all positions
              ),
              if (index < _team.teammates.length)
                Container(
                  margin: EdgeInsets.symmetric(horizontal: 16),
                  child: Row(
                    children: [
                      Container(
                        height: 0.5,
                        color: Colors.grey,
                        width: 30, // Increase the width for more spacing on the left
                      ),
                      // Container(
                      //   height: 0.5,
                      //   color: Colors.white,
                      //   width: 159, // Adjust the width of the white line
                      // ),
                      Expanded(
                        child: Divider(
                          color: Colors.grey,
                          thickness: 0.5,
                        ),
                      ),
                      // Container(
                      //   height: 0.5,
                      //   color: Colors.white,
                      //   width: 160, // Adjust the width of the white line
                      // ),
                      Container(
                        height: 0.5,
                        color: Colors.grey,
                        width: 30, // Increase the width for more spacing on the right
                      ),
                    ],
                  ),
                ),
            ],
          );
        },
      )),
    );
  }
}
