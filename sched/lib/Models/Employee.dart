class Employee {
  final String firstName;
  final String lastName;
  final String phone;
  final String email;
  late final List<String> positionTitles;
  late final String fullName;
  final String? employeeId;

  Employee({
    required this.firstName,
    required this.lastName,
    required this.phone,
    required this.email,
    required this.positionTitles,
    this.employeeId,
  }){
    for(int i = 0; i < this.positionTitles.length; i++)
      {
        this.positionTitles[i] = format(this.positionTitles[i]);
      }
    this.fullName = "${this.firstName} ${this.lastName}";
  }

  String format(String positionTitle) {
    List<String> ogWords = positionTitle.split(" ");
    List<String> newWords = [];
    for(String word in ogWords)
    {
      newWords.add(word[0].toUpperCase() + word.substring(1).toLowerCase());
    }
    return newWords.join(" ");
  }
}

class Team {
  final List<Employee> teammates;
  final Employee manager;
  final Employee? self;

  Team({
    required this.teammates,
    required this.manager,
    this.self,
  });
}