#define pino_motor 11
#define pino_sensor 10
#define pino_led 13
#define pino_led_sensor 12

#include <Thread.h>
#include <SevSeg.h>

SevSeg sevseg;

Thread contador_thread = Thread();

int contagem = 0;

void contador() {
  
  contagem++;
  digitalWrite(pino_led,HIGH);
  delay(500);
  digitalWrite(pino_led,LOW);
  
  if (contagem > 5) {
    contador_thread.enabled = false;
    analogWrite(pino_motor,255);
    contagem = 500;
  }
    
}

void setup() {

  pinMode(pino_motor,OUTPUT);
  pinMode(pino_sensor,INPUT);
  pinMode(pino_led,OUTPUT);

  contador_thread.onRun(contador);
  contador_thread.setInterval(500);

  byte numDigits = 1;
  byte digitPins[] = {};
  byte segmentPins[] = {2,3,4,5,6,7,8,9};
  bool resistorsOnSegments = true;

  byte hardwareConfig = COMMON_ANODE; 
  sevseg.begin(hardwareConfig, numDigits, digitPins, segmentPins, resistorsOnSegments);
  sevseg.setBrightness(50);
  
}

void loop() {

  sevseg.setNumber(contagem);
  sevseg.refreshDisplay();

  if (contador_thread.shouldRun())
    contador_thread.run();

  if (digitalRead(pino_sensor) == HIGH) {
    digitalWrite(pino_led_sensor,HIGH);
    contagem = 0;
    contador_thread.enabled = true;
    analogWrite(pino_motor,0);
  }
  else {
    digitalWrite(pino_led_sensor,LOW);
  }

  
}
