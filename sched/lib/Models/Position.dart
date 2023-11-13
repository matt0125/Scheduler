class Position {
  final id;
  final name;
  late final printName;

  Position({
    required this.id,
    required this.name,
  }){
    this.printName = format(this.name);
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