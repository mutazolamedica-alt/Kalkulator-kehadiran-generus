document.addEventListener("DOMContentLoaded", () => {

    const calculateButton = document.getElementById("calculateButton");
    const attendancePercentage = document.getElementById("attendancePercentage");

    /* ==========================================
       INPUT PAGE
    ========================================== */

    if (calculateButton) {

        const groupButtons = document.querySelectorAll("[data-group]");
        const levelButtons = document.querySelectorAll("[data-level]");

        const monthInput = document.getElementById("monthInput");

        const modal = document.getElementById("confirmationModal");
        const confirmationText = document.getElementById("confirmationText");

        const cancelButton = document.getElementById("cancelButton");
        const confirmButton = document.getElementById("confirmButton");

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
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        monthNames.forEach((month, index) => {
            const option = document.createElement("option");

            option.value = `${index + 1}-${currentYear}`;
            option.textContent = `${month} ${currentYear}`;

            monthInput.appendChild(option);
        });

        /* Pilih bulan berjalan secara default */
        monthInput.value = `${currentMonth + 1}-${currentYear}`;

        /* ------------------------------------------
           SELECT GROUP
        ------------------------------------------ */

        groupButtons.forEach(button => {
            button.addEventListener("click", () => {

                groupButtons.forEach(item => {
                    item.classList.remove("selected");
                });

                button.classList.add("selected");
                selectedGroup = button.dataset.group;

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
                selectedLevel = button.dataset.level;

            });
        });

        /* ------------------------------------------
           OPEN CONFIRMATION
        ------------------------------------------ */

        calculateButton.addEventListener("click", () => {

            const participants = getNumber("participants");
            const meetings = getNumber("meetings");
            const permission = getNumber("permission");
            const sick = getNumber("sick");
            const absent = getNumber("absent");

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

            if (permission < 0 || sick < 0 || absent < 0) {
                showToast("Data kehadiran tidak boleh negatif.");
                return;
            }

            const totalOpportunity = participants * meetings;
            const totalNotPresent = permission + sick + absent;

            if (totalNotPresent > totalOpportunity) {
                showToast("Jumlah izin, sakit, dan alpa melebihi total kesempatan hadir.");
                return;
            }

            const selectedOption =
                monthInput.options[monthInput.selectedIndex];

            confirmationText.textContent =
                `${selectedGroup} • ${selectedLevel} • ${selectedOption.textContent}`;

            modal.classList.add("show");
            modal.setAttribute("aria-hidden", "false");
        });

        /* ------------------------------------------
           CANCEL
        ------------------------------------------ */

        cancelButton.addEventListener("click", closeModal);

        modal.addEventListener("click", event => {
            if (event.target === modal) {
                closeModal();
            }
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && modal.classList.contains("show")) {
                closeModal();
            }
        });

        function closeModal() {
            modal.classList.remove("show");
            modal.setAttribute("aria-hidden", "true");
        }

        /* ------------------------------------------
           CONFIRM
        ------------------------------------------ */

        confirmButton.addEventListener("click", () => {

            const participants = getNumber("participants");
            const meetings = getNumber("meetings");
            const permission = getNumber("permission");
            const sick = getNumber("sick");
            const absent = getNumber("absent");

            const totalOpportunity = participants * meetings;

            const present =
                totalOpportunity -
                permission -
                sick -
                absent;

            const attendancePercentage =
                (present / totalOpportunity) * 100;

            const permissionSickPercentage =
                ((permission + sick) / totalOpportunity) * 100;

            const absentPercentage =
                (absent / totalOpportunity) * 100;

            const selectedOption =
                monthInput.options[monthInput.selectedIndex];

            const calculationData = {
                group: selectedGroup,
                month: selectedOption.textContent,
                monthValue: monthInput.value,
                level: selectedLevel,

                participants,
                meetings,
                permission,
                sick,
                absent,

                present,
                attendancePercentage,
                permissionSickPercentage,
                absentPercentage
            };

            /*
             * SEMENTARA:
             * localStorage digunakan untuk pengujian frontend.
             *
             * NANTI DIGANTI:
             * Frontend → Apps Script → Google Sheets/Database.
             */
            localStorage.setItem(
                "generusCalculation",
                JSON.stringify(calculationData)
            );

            closeModal();

            window.location.href = "hasil.html";
        });
    }

    /* ==========================================
       RESULT PAGE
    ========================================== */

    if (attendancePercentage) {

        const rawData =
            localStorage.getItem("generusCalculation");

        if (!rawData) {
            window.location.href = "index.html";
            return;
        }

        let data;

        try {
            data = JSON.parse(rawData);
        } catch (error) {
            localStorage.removeItem("generusCalculation");
            window.location.href = "index.html";
            return;
        }

        const donutPercentage =
            document.getElementById("donutPercentage");

        const resultGroup =
            document.getElementById("resultGroup");

        const resultLevel =
            document.getElementById("resultLevel");

        const resultMonth =
            document.getElementById("resultMonth");

        const legendPresent =
            document.getElementById("legendPresent");

        const legendPermission =
            document.getElementById("legendPermission");

        const legendAbsent =
            document.getElementById("legendAbsent");

        const donutChart =
            document.getElementById("donutChart");

        function formatPercentage(value) {
            return value
                .toFixed(2)
                .replace(".", ",") + "%";
        }

        const present = Number(data.attendancePercentage);
        const permission = Number(data.permissionSickPercentage);
        const absent = Number(data.absentPercentage);

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

        /* Donut chart */
        const presentAngle = (present / 100) * 360;
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

        /* Navigation */
        document
            .getElementById("backButton")
            .addEventListener("click", () => {
                window.location.href = "index.html";
            });

        document
            .getElementById("backToInput")
            .addEventListener("click", () => {
                window.location.href = "index.html";
            });
    }

    /* ==========================================
       HELPER
    ========================================== */

    function getNumber(id) {
        const element = document.getElementById(id);

        if (!element) return 0;

        const value = Number(element.value);

        return Number.isFinite(value) ? value : 0;
    }

    function showToast(message) {

        const toast = document.getElementById("toast");

        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(window.__toastTimer);

        window.__toastTimer = setTimeout(() => {
            toast.classList.remove("show");
        }, 2800);
    }

});
