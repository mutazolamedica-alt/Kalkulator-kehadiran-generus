document.addEventListener("DOMContentLoaded", () => {

    const isInputPage = document.getElementById("calculateButton");
    const isResultPage = document.getElementById("attendancePercentage");


    /* ==========================================
       INPUT PAGE
    ========================================== */

    if (isInputPage) {

        const groupButtons =
            document.querySelectorAll("[data-group]");

        const levelButtons =
            document.querySelectorAll("[data-level]");

        const monthInput =
            document.getElementById("monthInput");

        const modal =
            document.getElementById("confirmationModal");

        const confirmationText =
            document.getElementById("confirmationText");

        const cancelButton =
            document.getElementById("cancelButton");

        const confirmButton =
            document.getElementById("confirmButton");


        let selectedGroup = "";
        let selectedLevel = "";


        /* ------------------------------------------
           GENERATE MONTH
        ------------------------------------------ */

        const monthNames = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember"
        ];


        const currentDate = new Date();

        const currentMonth =
            currentDate.getMonth();

        const currentYear =
            currentDate.getFullYear();


        monthNames.forEach((month, index) => {

            const option =
                document.createElement("option");

            option.value =
                `${index + 1}-${currentYear}`;

            option.textContent =
                `${month} ${currentYear}`;

            monthInput.appendChild(option);

        });


        /* ------------------------------------------
           SELECT GROUP
        ------------------------------------------ */

        groupButtons.forEach(button => {

            button.addEventListener("click", () => {

                groupButtons.forEach(item => {
                    item.classList.remove("selected");
                });

                button.classList.add("selected");

                selectedGroup =
                    button.dataset.group;

            });

        });


        /* ------------------------------------------
           SELECT LEVEL
        ------------------------------------------ */

        levelButtons.forEach(button => {

            button.addEventListener("click", () => {

                levelButtons.forEach(item => {
                    item.classList.remove("selected");
                });

                button.classList.add("selected");

                selectedLevel =
                    button.dataset.level;

            });

        });


        /* ------------------------------------------
           SHOW MODAL
        ------------------------------------------ */

        isInputPage.addEventListener("click", () => {

            const participants =
                Number(
                    document.getElementById("participants").value
                );

            const meetings =
                Number(
                    document.getElementById("meetings").value
                );

            const permission =
                Number(
                    document.getElementById("permission").value
                );

            const sick =
                Number(
                    document.getElementById("sick").value
                );

            const absent =
                Number(
                    document.getElementById("absent").value
                );


            /* BASIC VALIDATION */

            if (!selectedGroup) {
                showToast("Silakan pilih kelompok terlebih dahulu.");
                return;
            }


            if (!monthInput.value) {
                showToast("Silakan pilih bulan terlebih dahulu.");
                return;
            }


            if (!selectedLevel) {
                showToast("Silakan pilih jenjang terlebih dahulu.");
                return;
            }


            if (participants <= 0) {
                showToast("Jumlah peserta harus lebih dari 0.");
                return;
            }


            if (meetings <= 0) {
                showToast("Jumlah pertemuan harus lebih dari 0.");
                return;
            }


            if (
                permission < 0 ||
                sick < 0 ||
                absent < 0
            ) {
                showToast("Data kehadiran tidak boleh negatif.");
                return;
            }


            const totalOpportunity =
                participants * meetings;

            const totalAbsent =
                permission + sick + absent;


            /* DATA TIDAK BOLEH MELEBIHI
               TOTAL KESEMPATAN */

            if (totalAbsent > totalOpportunity) {

                showToast(
                    "Jumlah izin, sakit, dan alpa melebihi total kesempatan hadir."
                );

                return;
            }


            const selectedOption =
                monthInput.options[
                    monthInput.selectedIndex
                ];


            confirmationText.textContent =
                `${selectedGroup} • ${selectedLevel} • ${selectedOption.textContent}`;


            modal.classList.add("show");

        });


        /* ------------------------------------------
           CANCEL
        ------------------------------------------ */

        cancelButton.addEventListener("click", () => {

            modal.classList.remove("show");

        });


        /* ------------------------------------------
           CONFIRM
        ------------------------------------------ */

        confirmButton.addEventListener("click", () => {

            const participants =
                Number(
                    document.getElementById("participants").value
                );

            const meetings =
                Number(
                    document.getElementById("meetings").value
                );

            const permission =
                Number(
                    document.getElementById("permission").value
                );

            const sick =
                Number(
                    document.getElementById("sick").value
                );

            const absent =
                Number(
                    document.getElementById("absent").value
                );


            const totalOpportunity =
                participants * meetings;


            const present =
                totalOpportunity -
                permission -
                sick -
                absent;


            const attendancePercentage =
                (present / totalOpportunity) * 100;


            const permissionSickPercentage =
                ((permission + sick) /
                    totalOpportunity) * 100;


            const absentPercentage =
                (absent /
                    totalOpportunity) * 100;


            const selectedOption =
                monthInput.options[
                    monthInput.selectedIndex
                ];


            const calculationData = {

                group: selectedGroup,

                month:
                    selectedOption.textContent,

                monthValue:
                    monthInput.value,

                level:
                    selectedLevel,

                participants:
                    participants,

                meetings:
                    meetings,

                permission:
                    permission,

                sick:
                    sick,

                absent:
                    absent,

                present:
                    present,

                attendancePercentage:
                    attendancePercentage,

                permissionSickPercentage:
                    permissionSickPercentage,

                absentPercentage:
                    absentPercentage

            };


            /*
             * UNTUK TAHAP FRONTEND:
             * Data sementara disimpan di browser.
             *
             * NANTI akan diganti dengan:
             * Frontend → Apps Script → Database.
             */

            localStorage.setItem(
                "generusCalculation",
                JSON.stringify(calculationData)
            );


            modal.classList.remove("show");


            /*
             * PINDAH HALAMAN
             */

            window.location.href =
                "hasil.html";

        });


        /* ------------------------------------------
           CLOSE MODAL WHEN CLICK OUTSIDE
        ------------------------------------------ */

        modal.addEventListener("click", event => {

            if (event.target === modal) {
                modal.classList.remove("show");
            }

        });

    }


    /* ==========================================
       RESULT PAGE
    ========================================== */

    if (isResultPage) {

        const rawData =
            localStorage.getItem(
                "generusCalculation"
            );


        if (!rawData) {

            window.location.href =
                "index.html";

            return;
        }


        const data =
            JSON.parse(rawData);


        /* ------------------------------------------
           ELEMENTS
        ------------------------------------------ */

        const attendancePercentage =
            document.getElementById(
                "attendancePercentage"
            );

        const donutPercentage =
            document.getElementById(
                "donutPercentage"
            );

        const resultGroup =
            document.getElementById(
                "resultGroup"
            );

        const resultLevel =
            document.getElementById(
                "resultLevel"
            );

        const resultMonth =
            document.getElementById(
                "resultMonth"
            );

        const legendPresent =
            document.getElementById(
                "legendPresent"
            );

        const legendPermission =
            document.getElementById(
                "legendPermission"
            );

        const legendAbsent =
            document.getElementById(
                "legendAbsent"
            );

        const donutChart =
            document.getElementById(
                "donutChart"
            );


        /* ------------------------------------------
           FORMAT PERCENTAGE
        ------------------------------------------ */

        function formatPercentage(value) {

            return value
                .toFixed(2)
                .replace(".", ",") + "%";

        }


        const present =
            data.attendancePercentage;

        const permission =
            data.permissionSickPercentage;

        const absent =
            data.absentPercentage;


        /* ------------------------------------------
           DISPLAY
        ------------------------------------------ */

        attendancePercentage.textContent =
            formatPercentage(present);

        donutPercentage.textContent =
            formatPercentage(present);


        resultGroup.textContent =
            data.group;

        resultLevel.textContent =
            data.level;

        resultMonth.textContent =
            data.month;


        legendPresent.textContent =
            formatPercentage(present);

        legendPermission.textContent =
            formatPercentage(permission);

        legendAbsent.textContent =
            formatPercentage(absent);


        /* ------------------------------------------
           DONUT CHART
        ------------------------------------------ */

        const presentAngle =
            (present / 100) * 360;

        const permissionAngle =
            ((present + permission) / 100) * 360;


        donutChart.style.setProperty(
            "--present-angle",
            `${presentAngle}deg`
        );


        donutChart.style.setProperty(
            "--permission-angle",
            `${permissionAngle}deg`
        );


        /* ------------------------------------------
           BACK BUTTON
        ------------------------------------------ */

        document
            .getElementById("backButton")
            .addEventListener("click", () => {

                window.location.href =
                    "index.html";

            });


        document
            .getElementById("backToInput")
            .addEventListener("click", () => {

                window.location.href =
                    "index.html";

            });

    }


    /* ==========================================
       TOAST FUNCTION
    ========================================== */

    function showToast(message) {

        const toast =
            document.getElementById("toast");

        if (!toast) return;


        toast.textContent = message;

        toast.classList.add("show");


        setTimeout(() => {

            toast.classList.remove("show");

        }, 2800);

    }

});
