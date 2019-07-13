// Definindo a pinagem dos sensores e atuadores
#define pino_motor      9
#define pino_led_sensor 10
#define pino_sensor     11

// Incluindo bibliotecas
#include <Thread.h>
#include <SevSeg.h>

// Declarando variáveis de controle
SevSeg sevseg;
Thread contador_thread = Thread();
short  contagem = 500;

// Contador de 0 a 5. O 500 é apenas uma forma de zerar o display.
// Este é um Callback executado pela thread de contagem.
void contador_callback() {

  // Incrementa a contagem...
  contagem++;

  // ...e quando esta atinge 5
  if (contagem > 5) {
    
    contador_thread.enabled = false;  // ... desativo a thread de contagem, ...
    analogWrite(pino_motor,255);      // ... ligo o motor e ...
    contagem = 500;                   // ... "desligo" o display de contagem
    
  }
    
}

// Inicializaćão de parametros de sistema
void setup() {

  // Definindo o comportamento das portas
  pinMode(pino_motor,OUTPUT);
  pinMode(pino_sensor,INPUT);
  pinMode(pino_led_sensor,OUTPUT);

  // Configurando a thread de contagem
  contador_thread.onRun(contador_callback);
  contador_thread.setInterval(1000);
  contador_thread.enabled = false;

  // Configurando o display de 7 segmentos
  byte numDigits = 1;
  byte digitPins[] = {};
  byte segmentPins[] = {A3,A2,4,3,2,A4,A5};
  bool resistorsOnSegments = true;
  byte hardwareConfig = COMMON_ANODE;
  
  sevseg.begin(hardwareConfig, numDigits, digitPins, segmentPins, resistorsOnSegments);
  sevseg.setBrightness(50);

  // Aqui o motor está inicialmente ligado
  analogWrite(pino_motor,255);
  
}

// Loop principal
void loop() {

  // Verifica a entrada do sensor. Se foi ativado, ...
  if (digitalRead(pino_sensor) == HIGH) {
    
    digitalWrite(pino_led_sensor,HIGH);   // ... indico pelo LED, ...
    analogWrite(pino_motor,0);            // ... desligo o motor, ...
    
    contagem = 0;                         // ... reinicio a contagem e ...
    contador_thread.enabled = true;       // ... ativo a thread de contagem.
    
  }
  else {
    digitalWrite(pino_led_sensor,LOW);    // Caso contrário, apenas mantenho o LED desligado
  }

  // Imprime a contagem atual no display de 7 segmentos
  sevseg.setNumber(contagem);
  sevseg.refreshDisplay();

  // Executa a thread
  if (contador_thread.shouldRun())
    contador_thread.run();

}
