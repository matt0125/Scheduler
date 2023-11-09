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
    TeamMember(
      name: 'Alice Johnson',
      email: 'alice@example.com',
      phoneNumber: '555-123-4567',
      positions: ['Manager', 'Designer'],
    ),
    TeamMember(
      name: 'Bob Brown',
      email: 'bob@example.com',
      phoneNumber: '444-987-6543',
      positions: ['Developer'],
    ),
    TeamMember(
      name: 'Ella Wilson',
      email: 'ella@example.com',
      phoneNumber: '333-555-1234',
      positions: ['Designer', 'Tester'],
    ),
    TeamMember(
      name: 'David Lee',
      email: 'david@example.com',
      phoneNumber: '222-444-9876',
      positions: ['Developer', 'Tester'],
    ),
    TeamMember(
      name: 'Grace Moore',
      email: 'grace@example.com',
      phoneNumber: '111-333-5555',
      positions: ['Manager'],
    ),
    TeamMember(
      name: 'Michael Johnson',
      email: 'michael@example.com',
      phoneNumber: '999-888-7777',
      positions: ['Tester'],
    ),
    TeamMember(
      name: 'Olivia Taylor',
      email: 'olivia@example.com',
      phoneNumber: '777-999-8888',
      positions: ['Designer'],
    ),
    TeamMember(
      name: 'Sophia White',
      email: 'sophia@example.com',
      phoneNumber: '555-777-9999',
      positions: ['Developer', 'Manager'],
    ),
    TeamMember(
      name: 'William Harris',
      email: 'william@example.com',
      phoneNumber: '111-222-3333',
      positions: ['Designer', 'Manager'],
    ),
    TeamMember(
      name: 'Mia Jackson',
      email: 'mia@example.com',
      phoneNumber: '444-555-6666',
      positions: ['Developer', 'Tester'],
    ),
    TeamMember(
      name: 'James Wilson',
      email: 'james@example.com',
      phoneNumber: '555-666-7777',
      positions: ['Manager'],
    ),
    TeamMember(
      name: 'Emma Garcia',
      email: 'emma@example.com',
      phoneNumber: '666-777-8888',
      positions: ['Tester'],
    ),
    TeamMember(
      name: 'Liam Martinez',
      email: 'liam@example.com',
      phoneNumber: '888-999-0000',
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
                    SizedBox(height: 12),
                    Text(member.email),
                    // Add spacing here
                    Text(member.phoneNumber),
                  ],
                ),
              ],
            ),
            subtitle: Text(member.positions.join(', ')), // Display all positions
          );
        },
      ),
    );
  }
}
