const studentForm = document.getElementById("student-form");
const studentList = document.getElementById("student-list");
const exportBtn = document.getElementById("export-btn");
const importFile = document.getElementById("import-file");

let students = JSON.parse(localStorage.getItem("students")) || [];

// Atualiza lista de alunos
function renderStudents() {
    studentList.innerHTML = students.map((student, index) => `
      <li>
        <div class="info">
          <span>Nome:</span> ${student.name}
          <span>Idade:</span> ${student.age} anos
          <span>Turma:</span> ${student.class}
          <span>Telefone:</span> ${student.phone}
          <span>Email:</span> ${student.email}
          <span>Endereço:</span> ${student.address}
        </div>
        <div class="actions">
          <button class="edit-btn" onclick="editStudent(${index})">Editar</button>
          <button class="delete-btn" onclick="deleteStudent(${index})">Excluir</button>
        </div>
      </li>
    `).join("");
  }  

// Cadastrar aluno
function addStudent(e) {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const className = document.getElementById("class").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  students.push({ name, age, class: className, phone, email, address });
  localStorage.setItem("students", JSON.stringify(students));

  studentForm.reset();
  renderStudents();
}

// Editar aluno
function editStudent(index) {
  const student = students[index];

  // Preenche o formulário com os dados do aluno
  document.getElementById("name").value = student.name;
  document.getElementById("age").value = student.age;
  document.getElementById("class").value = student.class;
  document.getElementById("phone").value = student.phone;
  document.getElementById("email").value = student.email;
  document.getElementById("address").value = student.address;

  // Alterar o comportamento do botão de submit para "Atualizar"
  studentForm.removeEventListener("submit", addStudent);
  studentForm.addEventListener("submit", (e) => updateStudent(e, index));
}

// Atualizar aluno
function updateStudent(e, index) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const age = document.getElementById("age").value;
  const className = document.getElementById("class").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;

  // Atualiza os dados do aluno
  students[index] = { name, age, class: className, phone, email, address };

  // Salva novamente no localStorage
  localStorage.setItem("students", JSON.stringify(students));

  // Reseta o formulário e volta ao comportamento inicial
  studentForm.reset();
  studentForm.removeEventListener("submit", updateStudent);
  studentForm.addEventListener("submit", addStudent);

  // Re-renderiza a lista de alunos
  renderStudents();
}

// Excluir aluno
function deleteStudent(index) {
  students.splice(index, 1); // Remove o aluno da lista
  localStorage.setItem("students", JSON.stringify(students)); // Atualiza o localStorage
  renderStudents(); // Atualiza a exibição dos alunos
}

// Exportar dados
exportBtn.addEventListener("click", () => {
  const data = JSON.stringify(students);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "students.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Importar dados
importFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const importedData = JSON.parse(event.target.result);
      students = importedData;
      localStorage.setItem("students", JSON.stringify(students));
      renderStudents();
    };
    reader.readAsText(file);
  }
});

// Inicializa a lista de alunos
renderStudents();

// Adicionar aluno no formulário
studentForm.addEventListener("submit", addStudent);