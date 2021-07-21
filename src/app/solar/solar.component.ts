import { Component } from '@angular/core';

@Component({
  selector: 'app-solar',
  templateUrl: './solar.component.html',
  styleUrls: ['./solar.component.scss']
})
export class SolarComponent {


  stepperArduinoSnippet: string = `
    #include &lsaquo;avr/sleep.h&rsaquo;
    #define interruptPin 2 //pin we are going to use to wake up the Arduino
    #include &lsaquo;DS3232RTC.h&rsaquo; 
    #include &lsaquo;AccelStepper.h&rsaquo;

    unsigned long time_value;

    unsigned long int previousMillis = 0;

    // Stepper motor
    #define dirPin 3    //direction pin
    #define stepPin 4   //pin which determines steps
    #define motorInterfaceType 1  // when we are using driver
                                  // motor interface type needs to be set to 1
    AccelStepper stepper = AccelStepper(motorInterfaceType, stepPin, dirPin);

    #define BJTPin 5   //pin used to block current through driver
                
    void setup() {
      Serial.begin(9600); //start Serial Comunication
      stepperSetup();
      pinMode(LED_BUILTIN,OUTPUT);        //we use the led on pin 13 to indicate when Arduino is asleep
      pinMode(interruptPin,INPUT_PULLUP); //set pin d2 to input using the builtin pullup resistor
      digitalWrite(LED_BUILTIN,HIGH);     //turning LED on

      pinMode(BJTPin, OUTPUT);    // when pin 5 is set to HIGH then current starts to flow between COLLECTOR
                                  // and EMITTER on BJT 2N3094
                                  // this is used to switch current through driver
    
      //initialize the alarms to known values, clear the alarm flags, clear the alarm interrupt flags
      RTC.setAlarm(ALM1_MATCH_DATE, 0, 0, 0, 1);
      RTC.setAlarm(ALM2_MATCH_DATE, 0, 0, 0, 1);
      RTC.alarm(ALARM_1);
      RTC.alarm(ALARM_2);
      RTC.alarmInterrupt(ALARM_1, false);
      RTC.alarmInterrupt(ALARM_2, false);
      RTC.squareWave(SQWAVE_NONE);
      
      //    uncomment the block block to set the time on your RTC. Remember to comment it again
      //    otherwise you will set the time at everytime you upload the sketch
      //    Begin block
      
      //tmElements_t tm;
      //tm.Hour = 19;               //set the RTC to an arbitrary time
      //tm.Minute = 47;
      //tm.Second = 00;
      //tm.Day = 12;
      //tm.Month = 7;
      //tm.Year = 2020 - 1970;      //tmElements_t.Year is the offset from 1970
      //RTC.write(tm);              //set the RTC from the tm structure
      
      //    Block end
      
      time_t t;     //create temporary time variable so we can set the time and read the time from the RTC
      t=RTC.get();  //gets the current time of the RTC

      time_value=10UL;
      
      RTC.setAlarm(ALM1_MATCH_HOURS, 0, 0, time_value, 0);
      //clear the alarm flag
      RTC.alarm(ALARM_1);
      //configure the INT/SQW pin for "interrupt" operation (disable square wave output)
      RTC.squareWave(SQWAVE_NONE);
      //enable interrupt output for Alarm 1
      RTC.alarmInterrupt(ALARM_1, true);
    }

    void loop() {
      time_t value = RTC.get();  

      //from April to September(included) stepper should run for 6 hours and then go to sleep
      if(month(value)>=4 && month(value)<=9){
        if(hour(value)>15){
          Going_To_Sleep();  
      }
        else{
          previousMillis=millis();
          //it will run for 6hrs
          while(millis()-previousMillis<=21600000UL){
            stepper.runSpeed();
          }
        }
      }

      //from January to March(included) and from October to December(included) stepper should run 
      //for 3,5 hours and then go to sleep
      if((month(value)>=1 && month(value)<=3) || (month(value)>=10 && month(value)<=12)){
        if(hour(value)>13){
          Going_To_Sleep();  
        }
        else{
          previousMillis=millis();
          //it will run for 3,5hrs
          while(millis()-previousMillis<=12600000UL){
            stepper.runSpeed();
          }
        }
      }

    }

    void wakeUp(){
      sleep_disable();      //disable sleep mode
      detachInterrupt(0);   //removes the interrupt from pin 2;
    }

    void stepperSetup() {
      stepper.setMaxSpeed(800);
      stepper.setSpeed(35);
    }

    void Going_To_Sleep(){

        digitalWrite(5, LOW);
        sleep_enable(); //enabling sleep mode
        attachInterrupt(0, wakeUp, LOW);  //attaching a interrupt to pin d2
        set_sleep_mode(SLEEP_MODE_PWR_DOWN);  //setting the sleep mode, in our case full sleep
        digitalWrite(LED_BUILTIN,LOW);  //turning LED off
        time_t t;     //creates temp time variable
        t=RTC.get();  //gets current time from rtc
        delay(1000);  //wait a second to allow the led to be turned off before going to sleep
        sleep_cpu();  //activating sleep mode
      
    //  ------------------------ HERE ARDUINO WAKES UP ------------------------    
      
        digitalWrite(LED_BUILTIN,HIGH); //turning LED on
        digitalWrite(5, HIGH);  //current starts to flow through driver

      
        t=RTC.get();

        time_value=10UL;

        RTC.setAlarm(ALM1_MATCH_HOURS , 0, 0, time_value, 0);
        //clear the alarm flag
        RTC.alarm(ALARM_1);
    }
      `;

  wemosSnippet: string = `
    #include "ESP8266WiFi.h"
    #include &lsaquo;NTPtimeESP.h&rsaquo;
    #include &lsaquo;Wire.h&rsaquo;
    #include &lsaquo;Adafruit_INA219.h&rsaquo;
    #include &lsaquo;SPI.h&rsaquo;

    //two INA219 devices are used, and they should have different addresses
    Adafruit_INA219 ina219_A;           //default address
    Adafruit_INA219 ina219_B(0x41);     //this address is achieved with jumper (A0) on device 

    NTPtime NTPhr("hr.pool.ntp.org");   //Choose server pool as required
    strDateTime dateTime;

    const char* ssid = "**********"; //SECRET_SSID; //Enter SSID
    const char* password = "**********" ; //SECRET_PASS; //Enter Password 
    char host[] = "***.***.*.*"; //IPv4 address
    const int port = **** ;   //port on which server listens

    //variables for ina219_A -> values for generation
    static float currentSumA = 0;
    static int countA = 0;
    static float powerSumA = 0;
    static float voltageSumA = 0;

    //variables for ina219_B -> values for consumption
    static float currentSumB = 0;
    static int countB = 0;
    static float powerSumB = 0;
    static float voltageSumB = 0;

    WiFiClient client;    //use for TCP connections

    void setup() {
      Serial.begin(9600); 
      ina219_A.begin();
      ina219_B.begin();

      pinMode(12, OUTPUT);      //it is used for waking up arduino nano, this is pin D6 on WEMOS
  
      digitalWrite(12, LOW);    //LOW signal triggers interrupt on arduino nano
    
      WiFi.enableInsecureWEP();
      WiFi.begin(ssid, password);   // Connect to WiFi
  
      measurementA();       //ina219_A measurements
      measurementB();       //ina219_B measurements
  
      while(WiFi.waitForConnectResult() != WL_CONNECTED) //while(WiFi.status() != WL_CONNECTED)
      {
        measurementA();
        measurementB();
        delay(100);
        if(millis()>25000){         
          break;
        }
      }

      //if does not connect to WiFi in 25 seconds then go to sleep
      if(WiFi.status() != WL_CONNECTED)
      {
        while(millis()<40000)
        {
          delay(10);
        }
        digitalWrite(12, HIGH);
        delay(500);
        ESP.deepSleep(92069e4);
      }

      //read date and time
      while(!(dateTime = NTPhr.getNTPtime(1.0, 1)).valid)
      {
        delay(100);
      }
  
      measurementA();
      measurementB();
  
      while(millis()<30000)
      {
        delay(10);
      }
  
      measurementA();
      measurementB();

      String timeAndDate = timeCalculation(dateTime);

      measurementA();
      measurementB();
  
      while(millis()<40000)
      {
        delay(10);
      }
  
      measurementA();
      String allMeasurementsA = printMeasurementsA(voltageSumA, currentSumA, powerSumA, countA, millis());

      measurementB();
      String allMeasurementsB = printMeasurementsB(voltageSumB, currentSumB, powerSumB, countB, millis());

      //finalString will be sent to server, parsed, and values will be stored in database
      String finalString = timeAndDate + allMeasurementsA + allMeasurementsB;

      int indexA = allMeasurementsA.indexOf("Co:");
      int indexB = allMeasurementsB.indexOf("CCo:");
      String serialMeasurement = timeAndDate + allMeasurementsA.substring(0, indexA) + allMeasurementsB.substring(0, indexB) + "??#" ;   

      delay(10);

      Serial.println(serialMeasurement);

      delay(10);

      digitalWrite(12, HIGH);
  
      delay(10);

      //connection to client
      if(client.connect(host, port))
      {
        client.print(finalString); 

        delay(300);
  
        delay(300);

        client.stop();
      }
      else{
        delay(300);
        ESP.deepSleep(92069e4);
    
      }

      delay(300);

      ESP.deepSleep(92369e4);     //internal clock is not to precise, so it will go to sleep to approximately 14m20s
                                  //92369e4 us -> 15m23s, but it will actually be around 14m20s, I didn't want to use DS3231 for this (but that would be more precise)
    }


    void loop() 
    {
    }


    String timeCalculation(strDateTime dateAndTime)
    {
          strDateTime dateTime = dateAndTime; 
          String message = "";
          if(dateTime.valid)
          {   
            byte actualHour = dateTime.hour;
            byte actualMinute = dateTime.minute;
            byte actualSecond = dateTime.second;
            int actualYear = dateTime.year;
            byte actualMonth = dateTime.month;
            byte actualDay = dateTime.day;
  
            String Hour = actualHour < 10 ? "0" + String(actualHour) : String(actualHour);
            String Minute = actualMinute < 10 ? "0" + String(actualMinute) : String(actualMinute);
            String Second = actualSecond < 10 ? "0" + String(actualSecond) : String(actualSecond);
            String Year = actualYear < 10 ? "0" + String(actualYear) : String(actualYear);
            String Month = actualMonth < 10 ? "0" + String(actualMonth) : String(actualMonth);
            String Day = actualDay < 10 ? "0" + String(actualDay) : String(actualDay);
  
            message = Year + "." + Month + "." + Day + "." + " " + Hour + ":" + Minute + ":" + Second;
            message = "T:" + message;
          }
          else
          {
            Serial.print("dateTime is not valid");
            message = "dateTime is not valid";
          }
          return message;
    } 

    void measurementA()
    {
      float shuntvoltage = 0;
      float busvoltage = 0;
      float current_mA = 0;
      float loadvoltage = 0;
      float power_mW = 0;
      shuntvoltage = ina219_A.getShuntVoltage_mV();
      busvoltage = ina219_A.getBusVoltage_V();
      current_mA = ina219_A.getCurrent_mA();
      power_mW = ina219_A.getPower_mW();
      loadvoltage = busvoltage + (shuntvoltage / 1000);
      voltageSumA += loadvoltage;
      currentSumA += current_mA;
      powerSumA += currentSumA*voltageSumA;
      countA++;
    }

    void measurementB()
    {
      float shuntvoltage = 0;
      float busvoltage = 0;
      float current_mA = 0;
      float loadvoltage = 0;
      float power_mW = 0;
      shuntvoltage = ina219_B.getShuntVoltage_mV();
      busvoltage = ina219_B.getBusVoltage_V();
      current_mA = ina219_B.getCurrent_mA();
      power_mW = ina219_B.getPower_mW();
      loadvoltage = busvoltage + (shuntvoltage / 1000);
      voltageSumB += loadvoltage;
      currentSumB += current_mA;
      powerSumB += currentSumB*voltageSumB;
      countB++;
    }

    String printMeasurementsA(float volt, float curr, float powr, int count, unsigned long currentMillis)
    {
      String message = "";
      float voltage = volt / count;
      voltage = (voltage < 0) ? 0.0 : voltage;
  
      float current = curr / count;
      current = (current < 0) ? 0.0 : current;
  
      float power = voltage * current;
  
      float consumption = (power * currentMillis) / 3600000;      // consumption is now in mWh

      message = "V:"+String(voltage)+"Cu:"+String(current)+"Co:"+String(consumption)+"??";
      return message;
    }

    String printMeasurementsB(float volt, float curr, float powr, int count, unsigned long currentMillis)
    {
      String message = "";
      float voltage = volt / count;
      voltage = (voltage < 0) ? 0.0 : voltage;
  
      float current = curr / count;
      current = (current < 0) ? 0.0 : current;
  
      float power = voltage * current;
  
      float consumption = (power * currentMillis) / 3600000;      // consumption is now in mWh

      message = "CV:"+String(voltage)+"CCu:"+String(current)+"CCo:"+String(consumption)+"END#";
      return message;
    }`;


  arduinoLCDSnippet: string = `
  #include &lsaquo;Wire.h&rsaquo;
  #include &lsaquo;TFT.h&rsaquo;    //including library for drawing on display
  #include &lsaquo;SPI.h&rsaquo;
  #include &lsaquo;avr/sleep.h&rsaquo;
  #include &lsaquo;avr/power.h&rsaquo;

  //TFT 
  #define cs 10
  #define dc 9
  #define rst 8
  TFT tftScreen = TFT(cs, dc, rst);

  //this will be displayed on TFT
  char voltageArray[7];
  char currentArray[7];
  char powerArray[8];
  char dateArray[11];
  char timeArray[9];
  char stepperVoltageArray[7];
  char stepperCurrentArray[7];
  char stepperPowerArray[8];

  void setup() {
    Serial.begin(9600);
    setupDefinition();          // TFT
    pinMode(2, INPUT_PULLUP);   // pin 2 is used as interrupt pin, ARDUINO wakes up when pin 2 i s set to LOW
    pinMode(3, OUTPUT);         // when pin 3 is set to HIGH then current starts to flow between COLLECTOR and EMITTER on BJT 2N3094
                                // this is used to switch backlight of display ON and OFF
  }

  int flag = 0;
  char message[100];
  int hoursForDimmingDisplay = -1;

  void loop() {

    digitalWrite(3, HIGH);
    //ARDUINO receives serial communication from WEMOS
    //when message is correct set flag to 1, exit while loop and print everything on display
    if(Serial.available()>0){
        String espToArduinoMessage;
        while(espToArduinoMessage.indexOf("T:")<0 && flag==0){
            espToArduinoMessage = readSerialMessage();
            delay(1000);
            if(espToArduinoMessage.indexOf("T:")>=0&&espToArduinoMessage.indexOf("??")>=0){
              flag = 1;
            }
        }
      
        if(flag==1){
            delay(1000);
          
            tftScreen.stroke(0,0,0);
            cleanTFTScreen();
            tftScreen.stroke(0,0,255); 
         
            //this part of code is for displaying Date&Time on TFT
            String dateDisp = dateDisplay(espToArduinoMessage);
            String timeDisp = timeDisplay(espToArduinoMessage);
            String voltage = voltageDisplay(espToArduinoMessage);
            String current = currentDisplay(espToArduinoMessage);
            String power = powerDisplay(espToArduinoMessage);
            String stepperVoltage = stepperVoltageDisplay(espToArduinoMessage);
            String stepperCurrent = stepperCurrentDisplay(espToArduinoMessage);
            String stepperPower = stepperPowerDisplay(espToArduinoMessage);

            voltage.toCharArray(voltageArray,7);
            current.toCharArray(currentArray,7);
            power.toCharArray(powerArray,8);
            dateDisp.toCharArray(dateArray,11);
            timeDisp.toCharArray(timeArray,9);
            stepperVoltage.toCharArray(stepperVoltageArray,7);
            stepperCurrent.toCharArray(stepperCurrentArray,7);
            stepperPower.toCharArray(stepperPowerArray,8);

            delay(100);

            cleanTFTScreen();

            flag = 0;
            Serial.flush();

            //ARDUINO goes to sleep after 8PM and wakes up again at 10AM
            hoursForDimmingDisplay = hours(timeDisp);
            if((hoursForDimmingDisplay>=20 || hoursForDimmingDisplay <=10)){
              sleepNow();
            }
        } 
        flag = 0;
    }
  
  }

  //setting TFT display 
  void setupDefinition(){
    tftScreen.begin();
  
    tftScreen.background(0,0,0);
    tftScreen.stroke(0,0,255);
    tftScreen.setTextSize(1);
    tftScreen.text("Vpanel: ",5,4);    //(text, xPos, ypos)
    tftScreen.text("V", 86, 4);
    tftScreen.text("Vstepp: ",5,16);    //(text, xPos, ypos)
    tftScreen.text("V", 86, 16);

    tftScreen.text("Cpanel: ",5,33);    
    tftScreen.text("mA", 88, 33);
    tftScreen.text("Cstepp: ",5,45);    
    tftScreen.text("mA", 88, 45);

    tftScreen.text("Ppanel: ",5,62);   
    tftScreen.text("mW", 91, 62);
    tftScreen.text("Pstepp: ",5,74);   
    tftScreen.text("mW", 91, 74);

    tftScreen.text("Date: ", 5,97);    

    tftScreen.text("Time: ",5,120);   
    tftScreen.text("h", 76, 120);

  }

  //for reading message sent via serial from WEMOS
  String readSerialMessage(){
    char value[100]; 
    int index_count =0;
    while(Serial.available()>0){
      value[index_count]=Serial.read();
      if(value[index_count] == '#'){
        value[index_count] = '\0';
        break; 
      }
      index_count++;
      value[index_count] = '\0'; // Null terminate the string
    }
    String str(value);
    str.trim();
    return str;
  }

  String dateDisplay(String receivedMessage){
    String solution;
    char message [50];
    int index = receivedMessage.indexOf("T:"); 
    receivedMessage.remove(0, index+2);
    receivedMessage.toCharArray(message, 50);
    char numbers [8];
    int k = 0;
    int i = 0;
    while(k<8 && i<50){
      if(isDigit(message[i])){
        numbers[k] = message[i];
        k++;  
      }
      i++;
    }
    for(int i = 0; i < 8; i++){
      if(i<4){
        solution += numbers[i];  
      }
      else{
        if(i%2==0){
          solution += '.';  
        }  
        solution += numbers[i];
      }
    }
    solution += '.';
    return solution;
  }

  String timeDisplay(String receivedMessage){
    String solution;
    char message [50];
    int index = receivedMessage.indexOf("T:");
    receivedMessage.remove(0, index+2);
    receivedMessage.toCharArray(message, 50);
    char numbers [4];
    int k = 0;
    int i = 11;
    while(k<4 && i<50){
      if(isDigit(message[i])){
        numbers[k] = message[i];
        k++;  
      }
      i++;
    }
    for(int i = 0; i < 4; i++){
      if(i==2){
        solution += ':';  
      }
      solution += numbers[i];
    }
    return solution;
  }

  int hours(String timeDisplay){
    int solution;
    char hrsField [2];
    String hrs = timeDisplay.substring(0, 2);
    hrs.toCharArray(hrsField, 2);
    if(hrsField[0]=="0"){
      if(isDigit(hrsField[1])){
        solution = hrs.substring(1).toInt();
      } 
    }
    else{
      solution = hrs.toInt();
    }
    return solution;
  }

  String voltageDisplay(String receivedMessage){
    String solution;
    char message [50];
    int startIndex = receivedMessage.indexOf("V:") + 2; 
    int endIndex = receivedMessage.indexOf("Cu:");
    solution = receivedMessage.substring(startIndex, endIndex);
    return solution;
  }

  String currentDisplay(String receivedMessage){
    String solution;
    char message [50];
    int startIndex = receivedMessage.indexOf("Cu:") + 3; 
    int endIndex = receivedMessage.indexOf("CV:");
    solution = receivedMessage.substring(startIndex, endIndex);
    return solution;
  }

  String powerDisplay(String receivedMessage){

    String voltage = voltageDisplay(receivedMessage);
    String current = currentDisplay(receivedMessage);
    float power = voltage.toFloat() * current.toFloat();
    String solution = String(power);
    return solution;
  }

  String stepperVoltageDisplay(String receivedMessage){
    String solution;
    char message [50];
    int startIndex = receivedMessage.indexOf("CV:") + 3; 
    int endIndex = receivedMessage.indexOf("CCu:");
    solution = receivedMessage.substring(startIndex, endIndex);
    return solution;
  }

  String stepperCurrentDisplay(String receivedMessage){
    String solution;
    char message [50];
    int startIndex = receivedMessage.indexOf("CCu:") + 4; 
    int endIndex = receivedMessage.indexOf("??");
    solution = receivedMessage.substring(startIndex, endIndex);
    return solution;
  }

  String stepperPowerDisplay (String receivedMessage){
    String voltage = stepperVoltageDisplay(receivedMessage);
    String current = stepperCurrentDisplay(receivedMessage);
    float power = voltage.toFloat() * current.toFloat();
    String solution = String(power);
    return solution;
  }

  void cleanTFTScreen(){
    tftScreen.text(voltageArray,53,4);
    tftScreen.text(stepperVoltageArray,53,16);
    tftScreen.text(currentArray,53,33);
    tftScreen.text(stepperCurrentArray,53,45);
    tftScreen.text(powerArray,53,62);
    tftScreen.text(stepperPowerArray,53,74);
    tftScreen.text(dateArray,39,97);
    tftScreen.text(timeArray,39,120);
  }

  // here we put arduino to sleep
  void sleepNow(){         
      digitalWrite(3, LOW);
      Serial.flush();
      set_sleep_mode(SLEEP_MODE_PWR_DOWN);
      cli();
      sleep_enable();    
      attachInterrupt(digitalPinToInterrupt(2), wakeUpNow, LOW);
      sei();
      sleep_cpu();
  // ------------------ HERE ARDUINO WAKES UP ------------------
      sleep_disable(); 
      digitalWrite(3, HIGH);
  }

  void wakeUpNow(){
    detachInterrupt(digitalPinToInterrupt(2));  
}`;

}
