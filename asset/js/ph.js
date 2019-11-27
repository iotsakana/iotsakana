function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

var data = {
    suhu: 0,
    gas: 0,
    ph: 0,
    date: new Date(),
    date_str: new Date().toString(),
    nama: "Nama Anda",
    relay_name: ["Relay 1", "Relay 2", "Relay 3"],
    relay1: false,
    relay2: false,
    relay3: false,
    interval: 60
};

var datenow = new Date();
sleep(1000);

var datalast = new Date();

axios.get('http://gradien.co:7777/api/users/5dcd37f56b01563ad3f47a87/data')
    .then((response) => {
        if (response.data.data.mq == false) {
            temp_gas = 0;
        } else {
            temp_gas = 1;
        }
        data.nama = response.data.data.nama;
        data.relay_name = response.data.data.relay_name;
        data.relay1 = response.data.data.relay1;
        data.relay2 = response.data.data.relay2;
        data.relay3 = response.data.data.relay3;
        data.interval = response.data.data.interval;
    })
    .catch((error) => {
        console.log(error);
    });

sleep(2000);

function getData() {
    axios.get('http://gradien.co:7777/api/records/5dcd37f56b01563ad3f47a87/last')
        .then((response) => {
            if (response.data.data.mq == false) {
                temp_gas = 0;
            } else {
                temp_gas = 1;
            }
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'long' };
            const options2 = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };

            data.suhu = response.data.data.suhu;
            data.gas = temp_gas;
            data.ph = response.data.data.ph;
            data.date = new Date(response.data.data.created_at).toLocaleDateString('id-ID', options2);
            data.date_str = new Date(response.data.data.created_at).toLocaleDateString('id-ID', options);
        })
        .catch((error) => {
            console.log(error);
            document.getElementById('app').innerHTML = '<div class="col-12"><div class="pt-4 pr-4 pl-4 text-center"><div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Menyambung Ke Server Gagal , Kemungkinan Server sedang dalam perbaikan</strong></div></div></div>';
        });

    axios.get('http://gradien.co:7777/api/users/5dcd37f56b01563ad3f47a87/data')
        .then((response) => {
            data.nama = response.data.data.nama;
            data.relay_name = response.data.data.relay_name;
            data.relay1 = response.data.data.relay_1;
            data.relay2 = response.data.data.relay_2;
            data.relay3 = response.data.data.relay_3;
            data.interval = response.data.data.interval;
        })
        .catch((error) => {
            console.log(error);
        });

    return data;
}


Plotly.plot('ph', [{
    y: [data.ph],
    mode: 'lines+markers',
    marker: { color: 'green', size: 4 },
    line: { width: 2 },
    name: 'PH'
}]);

Plotly.plot('suhu', [{
    y: [data.suhu],
    mode: 'bar',
    marker: { color: 'blue', size: 4 },
    line: { width: 2 },
    name: 'Suhu'
}]);

Plotly.plot('gas', [{
    y: [data.gas],
    mode: 'lines+markers',
    marker: { color: 'red', size: 4 },
    line: { width: 2 },
    name: 'Gas'
        //,x: [data.date]
}]);

Plotly.plot('custome', [{
    y: [data.ph],
    mode: 'lines+markers',
    marker: { color: 'green', size: 4 },
    line: { width: 2 },
    name: 'PH'
        //,x: [data.date]
}, {
    y: [data.suhu],
    mode: 'lines+markers',
    marker: { color: 'blue', size: 4 },
    line: { width: 2 },
    name: 'Suhu'
        //,x: [data.date]
}, {
    y: [data.gas],
    mode: 'lines+markers',
    marker: { color: 'red', size: 4 },
    line: { width: 2 },
    name: 'Gas Belerang'
        //,x: [data.date]
}], { title: "Grafik Gabungan" });

var cnt = 0;
setInterval(function() {
    data = getData();
    console.log(data);
    document.getElementById("date-custome1").innerHTML = data.date_str;
    document.getElementById("date-custome2").innerHTML = data.date_str;
    document.getElementById("date-custome3").innerHTML = data.date_str;
    document.getElementById("date-custome4").innerHTML = data.date_str;

    document.getElementById("relay1").innerHTML = data.relay_name[0];
    document.getElementById("relay2").innerHTML = data.relay_name[1];
    document.getElementById("relay3").innerHTML = data.relay_name[2];
    let relay_1 = './asset/img/off.jpg';
    let relay_2 = './asset/img/off.jpg';
    let relay_3 = './asset/img/off.jpg';
    if (data.relay1 == true) {
        relay_1 = './asset/img/on.jpg';
    }
    if (data.relay2 == true) {
        relay_2 = './asset/img/on.jpg';
    }
    if (data.relay3 == true) {
        relay_3 = './asset/img/on.jpg';
    }
    document.getElementById("relay1status").src = relay1;
    document.getElementById("relay2status").src = relay2;
    document.getElementById("relay3status").src = relay3;

    document.getElementById("nama").innerHTML = data.nama;
    //=================================================
    // Hendeling When Data is Stack / Data not update;
    datanow = data.date;
    if (datanow == datalast) {
        document.getElementById('notif').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert"><strong>Data Sensor Berhenti</strong> pada ' + data.date_str + '</div>';
    } else {
        document.getElementById('notif').innerHTML = '';
    }
    datalast = datanow;
    //==================================================
    Plotly.extendTraces('custome', {
        y: [
                [data.ph],
                [data.suhu],
                [data.gas]
            ]
            // ,x: [
            //     [data.date],
            //     [data.date],
            //     [data.date]
            // ]

    }, [0, 1, 2]);

    Plotly.extendTraces('ph', {
        y: [
            [data.ph]
        ]
    }, [0]);

    Plotly.extendTraces('suhu', {
        y: [
            [data.suhu]
        ]
    }, [0]);

    Plotly.extendTraces('gas', {
        y: [
                [data.gas]
            ]
            // ,x: [
            //     [data.date]
            // ]
    }, [0]);
    cnt++;
    if (cnt > 500) {
        Plotly.relayout('ph', {
            xaxis: {
                range: [cnt - 500, cnt]
            }
        });
        Plotly.relayout('suhu', {
            xaxis: {
                range: [cnt - 500, cnt]
            }
        });
        Plotly.relayout('gas', {
            xaxis: {
                range: [cnt - 500, cnt]
            }
        });
        Plotly.relayout('custome', {
            xaxis: {
                range: [cnt - 500, cnt]
            }
        });
    }

}, 1000);