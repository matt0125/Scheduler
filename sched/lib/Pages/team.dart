import 'package:flutter/material.dart';

class TeamMember {
  final String name;
  final String email;
  final String phoneNumber;
  final List<String> positions;

  TeamMember({
    required this.name,
    required this.email,
    required this.phoneNumber,
    required this.positions,
  });
}

class TeamTab extends StatelessWidget {
  final List<TeamMember> teamMembers = [
    TeamMember(
      name: 'John Doe',
      email: 'john@example.com',
      phoneNumber: '123-456-7890',
      positions: ['Developer', 'Designer'],
    ),
    TeamMember(
      name: 'Jane Smith',
      email: 'jane@example.com',
      phoneNumber: '987-654-3210',
      positions: ['Designer'],
    ),
    // Add more team members here with their respective positions
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Team'),
        automaticallyImplyLeading: false,
      ),
      body: ListView.builder(
        itemCount: teamMembers.length,
        itemBuilder: (context, index) {
          TeamMember member = teamMembers[index];
          return ListTile(
            title: Text(member.name),
            trailing: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    SizedBox(height: 7),
                    Text(member.email),
                    // Add spacing here
                    Text(member.phoneNumber),
                  ],
                ),
              ],
            ),
            subtitle: Text(member.positions.join(', ')), // Display all positions
            onTap: () {
              // Add an action when a team member is tapped.
              // For example, you can navigate to a detailed profile page.
            },
          );
        },
      ),
    );
  }
}
