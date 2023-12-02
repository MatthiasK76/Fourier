let W = 1200;
let H = 600;
let HUESPREAD = 50;
let MAX_NUM = 10;

let time = 0;
let wave = [];
let curve = [];

let button_clear = 0;
let button_random = 0;
let input_num = 0;
let slider_strokeWeight = 0;
let input_curvelen = 0;
let input_dt = 0;
let input_coeff = [];
let check_curves = [];

function reset() {
    time = 0;
    wave = [];
    for (let i = 0; i < MAX_NUM; ++i)
        curve[i] = [];

    clear(0, 0, 0, 0);
    background(0);
}

function randomCoeff() {
    for (let i = 0; i < MAX_NUM; ++i) {
        let r = round(random(-5.0, 5.0), 1);
        input_coeff[i].value(r);
    }
}

function drawCurve(n, curve) {
    colorMode(HSB);
    strokeWeight(slider_strokeWeight.value());
    if (check_curves[n].checked() == true) {
        for (let i = curve.length - 1; i > 0; i--) {
            let cv = curve[i];
            let pv = curve[i - 1];

            let hue = (n * HUESPREAD) % 255;
            let sat = 255;
            let bright = 255 * (1.0 - i / curve.length);

            stroke(hue, sat, bright);
            line(pv.x, pv.y, cv.x, cv.y);
        }
    }
    strokeWeight(1);
}

function drawWave(wave, x, y) {
    push();
    translate(200, 0);
    stroke(100);
    ellipse(0, wave[0], 5);
    line(x - 200, y, 0, wave[0]);
    stroke(200);
    beginShape();
    noFill();
    for (let i = 0; i < wave.length; i++) {
        vertex(i, wave[i]);
    }
    endShape();
    pop();
}

function setup() {
    createCanvas(W, H);
    colorMode(HSB);

    button_clear = createButton('Clear');
    button_clear.mousePressed(reset);

    createDiv("Number of coefficients");
    input_num = createInput('3');
    input_num.attribute('type', 'number');
    input_num.attribute('min', '1');
    input_num.attribute('max', MAX_NUM);
    input_num.attribute('step', '1');
    input_num.style('width', '30px');

    createDiv("Curve stroke width");
    slider_strokeWeight = createSlider(1.0, 5.0, 5.0);

    createDiv("Length of curve");
    input_curvelen = createInput('2000');
    input_curvelen.attribute('type', 'number');
    input_curvelen.attribute('min', '1');
    input_curvelen.attribute('max', '10000');
    input_curvelen.attribute('step', '1');
    input_curvelen.style('width', '60px');

    createDiv("Omega");
    for (let i = 0; i < MAX_NUM; ++i) {
        input_coeff[i] = createInput("1.0");
        input_coeff[i].attribute('type', 'number');
        input_coeff[i].attribute('min', '-5');
        input_coeff[i].attribute('max', '5');
        input_coeff[i].attribute('step', '0.1');
        input_coeff[i].attribute('placeholder', 'w' + (i + 1));
        input_coeff[i].style('width', '50px');
    }
    button_random = createButton('Random');
    button_random.mousePressed(randomCoeff);

    createDiv("Draw curves");
    for (let i = 0; i < MAX_NUM; ++i) {
        curve[i] = [];
        check_curves[i] = createCheckbox("w" + (i + 1));
        check_curves[i].checked(false);
    }

    createDiv("Timewarp");
    input_dt = createInput('20');
    input_dt.attribute('type', 'number');
    input_dt.attribute('min', '0');
    input_dt.attribute('max', '100');
    input_dt.attribute('step', '5');
    input_dt.style('width', '60px');
}

function draw() {
    background(0);
    translate(0.2 * width, 0.5 * height);

    let x = 0;
    let y = 0;
    let h = 75;

    // do the Fourier-series
    for (let i = 0; i < input_num.value(); i++) {
        let prevx = x;
        let prevy = y;

        let n = i * 2 + 1;
        let radius = 4 * h / (n * PI);

        let omega = (i < input_coeff.length ? input_coeff[i].value() : 1.0);
        x += radius * cos(n * omega * time);
        y += radius * sin(n * omega * time);

        noFill();
        colorMode(HSB);
        stroke((i * HUESPREAD) % 255, 255, 32);
        ellipse(prevx, prevy, radius * 2);
        fill(200);
        line(prevx, prevy, x, y);
        ellipse(x, y, 5);

        while (curve[i].length > input_curvelen.value()) curve[i].pop();
        curve[i].unshift(createVector(x, y));
        drawCurve(i, curve[i]);
    }

    // save x-y-position to array

    // save y-position to array
    while (wave.length > width) wave.pop();
    wave.unshift(y);
    drawWave(wave, x, y);

    time += (0.001 * input_dt.value());
}
