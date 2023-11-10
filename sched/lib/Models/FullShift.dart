class FullShift {
  final String? startTime;
  final String? endTime;
  final String? positionTitle;
  final String? firstName;
  final String? lastName;
  String? fullName;
  String? printTime;

  FullShift({
    this.startTime,
    this.endTime,
    this.positionTitle,
    this.firstName,
    this.lastName,
  }){
    this.fullName = "${this.firstName} ${this.lastName}";
    if(this.startTime != null && this.endTime != null)
    {
      int startH = int.parse(this.startTime!.split(":")[0]);
      int endH = int.parse(this.endTime!.split(":")[0]);
      int startM = int.parse(this.startTime!.split(":")[1]);
      int endM = int.parse(this.endTime!.split(":")[1]);

      String startAM = startH < 12 ? "AM" : "PM";
      String endAM = endH < 12 ? "AM" : "PM";

      if(startH > 12)
        startH -= 12;
      if(endH > 12)
        endH -= 12;

      this.printTime = "${startH}:${startM} ${startAM != endAM ? startAM : ""}- ${endH}:${endM} ${endAM}";
    }
  }
}