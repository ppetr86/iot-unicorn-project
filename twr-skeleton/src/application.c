// Tower Kit documentation https://tower.hardwario.com/
// SDK API description https://sdk.hardwario.com/
// Forum https://forum.hardwario.com/

#include <application.h>

//accelerometer
twr_lis2dh12_t a;

// LED instance
twr_led_t led;

// Button instance
twr_button_t button;

// Thermometer instance
twr_tmp112_t tmp112;
uint16_t button_click_count = 0;
uint64_t id;

// Button event callback
void button_event_handler(twr_button_t *self, twr_button_event_t event, void *event_param)
{
    // Log button event
    twr_log_info("APP: Button event: %i", event);

    // Check event source
    if (event == TWR_BUTTON_EVENT_CLICK)
    {
        // Toggle LED pin state
        twr_led_set_mode(&led, TWR_LED_MODE_TOGGLE);

        // Publish message on radio
        button_click_count++;
        // puvodni kod nemazat - zacatek
        // twr_radio_pub_push_button(&button_click_count);
        // puvodni kod nemazat - konec

        char idAndValueTupleString[55];
        id = twr_radio_get_my_id();
        snprintf(idAndValueTupleString, sizeof(idAndValueTupleString), "%s %" PRIx64, "1", id);

        // Publish the string variable idString to the radio topic "accelerometer".
        twr_radio_pub_string("feeding", idAndValueTupleString);
    }

    if (event == TWR_BUTTON_EVENT_HOLD)
    {
        // Toggle LED pin state
        twr_led_set_mode(&led, TWR_LED_MODE_TOGGLE);

        char idAndValueTupleString[55];
        id = twr_radio_get_my_id();
        snprintf(idAndValueTupleString, sizeof(idAndValueTupleString), "%s %" PRIx64, "1", id);

        twr_radio_pub_string("drinking", idAndValueTupleString);
    }
}

void tmp112_event_handler(twr_tmp112_t *self, twr_tmp112_event_t event, void *event_param)
{
    if (event == TWR_TMP112_EVENT_UPDATE)
    {
        float celsius;
        // Read temperature
        twr_tmp112_get_temperature_celsius(self, &celsius);

        twr_log_debug("APP: temperature: %.2f °C", celsius);
        // puvodni kod nemazat - zacatek
        // twr_radio_pub_temperature(TWR_RADIO_PUB_CHANNEL_R1_I2C0_ADDRESS_ALTERNATE, &celsius);
        // puvodni kod nemazat - konec

        char idAndValueTupleString[55];
        id = twr_radio_get_my_id();
        snprintf(idAndValueTupleString, sizeof(idAndValueTupleString), "%f %" PRIx64, celsius, id);

        // Publish the string variable idString to the radio topic "accelerometer".
        twr_radio_pub_string("temperature", idAndValueTupleString);
    }
}

// alarm settings
twr_lis2dh12_alarm_t alarm1;

void lis2_event_handler(twr_lis2dh12_t *self, twr_lis2dh12_event_t event, void *event_param)
{
    (void)self;
    (void)event_param;

    if (event == TWR_LIS2DH12_EVENT_ALARM) {
        char idString[55];
        id = twr_radio_get_my_id();
        snprintf(idString, sizeof(idString), "%s %" PRIx64, "1", id);
        twr_radio_pub_string("danger", idString);
    }
}

///////////////////////

// Application initialization function which is called once after boot
void application_init(void)
{
    // Initialize logging
    twr_log_init(TWR_LOG_LEVEL_DUMP, TWR_LOG_TIMESTAMP_ABS);

    // Initialize LED
    twr_led_init(&led, TWR_GPIO_LED, false, 0);
    twr_led_pulse(&led, 2000);

    // Initialize button
    twr_button_init(&button, TWR_GPIO_BUTTON, TWR_GPIO_PULL_DOWN, 0);
    twr_button_set_event_handler(&button, button_event_handler, NULL);
    twr_button_set_hold_time(&button, 2000);

    // Initialize thermometer on core module
    twr_tmp112_init(&tmp112, TWR_I2C_I2C0, 0x49);
    twr_tmp112_set_event_handler(&tmp112, tmp112_event_handler, NULL);
    twr_tmp112_set_update_interval(&tmp112, 15000);

    // Initialize radio
    twr_radio_init(TWR_RADIO_MODE_NODE_SLEEPING);
    // Send radio pairing request
    twr_radio_pairing_request("skeleton", FW_VERSION);

    // accelerometer related:
    //  here you can set conditions for the alarm to be triggered
    alarm1.x_high = true;
    alarm1.threshold = 10;

    twr_led_init(&led, TWR_GPIO_LED, false, false);
    twr_led_set_mode(&led, TWR_LED_MODE_OFF);

    twr_lis2dh12_init(&a, TWR_I2C_I2C0, 0x19);
    twr_lis2dh12_set_alarm(&a, &alarm1);
    twr_lis2dh12_set_event_handler(&a, lis2_event_handler, NULL);
    twr_lis2dh12_set_update_interval(&a, 2000);
}

// Application task function (optional) which is called peridically if scheduled
void application_task(void)
{
    static int counter = 0;

    // Log task run and increment counter
    twr_log_debug("APP: Task run (count: %d)", ++counter);

    // Plan next run of this task in 150000 ms
    twr_scheduler_plan_current_from_now(150000);
}
