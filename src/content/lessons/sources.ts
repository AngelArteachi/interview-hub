/**
 * Fuentes de referencia por lección.
 * Criterio: documentación oficial, estándares (RFC, NIST, OWASP), universidades y autores reconocidos
 * con obra publicada. Nada de blogs anónimos ni sitios de contenido generado automáticamente.
 * Todos los enlaces se comprobaron el 2026-10-29: que respondan y que su contenido sea el que se cita
 * (no páginas movidas, vacías o de error).
 */
export interface Source {
  title: string;
  publisher: string;
  url: string;
}

const MIT_6006: Source = {
  title: '6.006 Introduction to Algorithms (curso completo con apuntes y videos)',
  publisher: 'MIT OpenCourseWare',
  url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
};
const OSTEP: Source = {
  title: 'Operating Systems: Three Easy Pieces (libro gratuito)',
  publisher: 'Remzi y Andrea Arpaci-Dusseau, Universidad de Wisconsin-Madison',
  url: 'https://pages.cs.wisc.edu/~remzi/OSTEP/',
};

export const LESSON_SOURCES: Record<string, Source[]> = {
  /* ---------- Estructuras de datos y algoritmos ---------- */
  'big-o': [MIT_6006, { title: 'Time complexity of operations on built-in types', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/builtins/time-complexity.html' }],
  'big-o-practice': [
    MIT_6006,
    { title: 'Time complexity of operations on built-in types', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/builtins/time-complexity.html' },
    { title: 'Built-in Types: nota sobre concatenar secuencias (costo cuadrático)', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/builtins/stdtypes.html' },
  ],
  'arrays-hashing': [
    { title: 'Data Structures (listas, diccionarios y sets)', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/tutorial/datastructures.html' },
    { title: 'Built-in Types: dict y set', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/builtins/stdtypes.html' },
    { title: 'Time complexity of operations on built-in types', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/builtins/time-complexity.html' },
  ],
  'two-pointers-window': [
    { title: 'Two Pointers', publisher: 'USACO Guide (guía de la USA Computing Olympiad)', url: 'https://usaco.guide/silver/two-pointers' },
    MIT_6006,
  ],
  'linked-lists': [
    { title: 'Bags, Queues, and Stacks (listas enlazadas)', publisher: 'Algorithms, 4th ed. — Sedgewick y Wayne, Princeton University', url: 'https://algs4.cs.princeton.edu/13stacks/' },
    MIT_6006,
  ],
  'stacks-queues': [
    { title: 'Bags, Queues, and Stacks', publisher: 'Algorithms, 4th ed. — Sedgewick y Wayne, Princeton University', url: 'https://algs4.cs.princeton.edu/13stacks/' },
    { title: 'collections.deque', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/collections.html' },
  ],
  recursion: [
    { title: 'Think Python, cap. 5: Conditionals and recursion', publisher: 'Allen B. Downey (Green Tea Press)', url: 'https://greenteapress.com/thinkpython2/html/thinkpython2006.html' },
    MIT_6006,
  ],
  sorting: [
    { title: 'Sorting (elementary sorts, mergesort, quicksort)', publisher: 'Algorithms, 4th ed. — Sedgewick y Wayne, Princeton University', url: 'https://algs4.cs.princeton.edu/20sorting/' },
    { title: 'Sorting Techniques', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/howto/sorting.html' },
  ],
  'binary-search': [{ title: 'bisect: búsqueda binaria en listas ordenadas', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/bisect.html' }, MIT_6006],
  trees: [{ title: 'Binary Search Trees', publisher: 'Algorithms, 4th ed. — Sedgewick y Wayne, Princeton University', url: 'https://algs4.cs.princeton.edu/32bst/' }, MIT_6006],
  heaps: [
    { title: 'Priority Queues (heaps binarios)', publisher: 'Algorithms, 4th ed. — Sedgewick y Wayne, Princeton University', url: 'https://algs4.cs.princeton.edu/24pq/' },
    { title: 'heapq: Heap queue algorithm', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/heapq.html' },
  ],
  graphs: [{ title: 'Undirected Graphs (DFS y BFS)', publisher: 'Algorithms, 4th ed. — Sedgewick y Wayne, Princeton University', url: 'https://algs4.cs.princeton.edu/41graph/' }, MIT_6006],
  'dp-intro': [MIT_6006, { title: 'functools.lru_cache (memoización)', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/functools.html' }],

  /* ---------- Programación y diseño ---------- */
  'oop-pillars': [
    { title: 'Classes', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/tutorial/classes.html' },
    { title: 'abc: clases base abstractas', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/abc.html' },
    { title: 'functools.singledispatch (cómo se imita la sobrecarga)', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/functools.html' },
  ],
  solid: [
    { title: 'The Single Responsibility Principle', publisher: 'Robert C. Martin (autor de los principios SOLID)', url: 'https://blog.cleancoder.com/uncle-bob/2014/05/08/SingleReponsibilityPrinciple.html' },
    { title: 'Design Patterns y principios de diseño', publisher: 'Refactoring.Guru — Alexander Shvets', url: 'https://refactoring.guru/design-patterns' },
  ],
  'design-patterns': [{ title: 'Design Patterns (catálogo con ejemplos)', publisher: 'Refactoring.Guru — Alexander Shvets', url: 'https://refactoring.guru/design-patterns' }],
  'clean-code': [
    { title: 'PEP 8 – Style Guide for Python Code', publisher: 'Python Software Foundation', url: 'https://peps.python.org/pep-0008/' },
    { title: 'Refactoring', publisher: 'Martin Fowler', url: 'https://refactoring.com/' },
  ],
  testing: [
    { title: 'The Practical Test Pyramid', publisher: 'Ham Vocke en martinfowler.com', url: 'https://martinfowler.com/articles/practical-test-pyramid.html' },
    { title: 'Get Started', publisher: 'Documentación oficial de pytest', url: 'https://docs.pytest.org/en/stable/getting-started.html' },
  ],
  'error-handling': [
    { title: 'Errors and Exceptions', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/tutorial/errors.html' },
    { title: 'Error Handling Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Error_Handling_Cheat_Sheet.html' },
  ],

  /* ---------- Web y backend ---------- */
  'how-web-works': [
    { title: 'How the web works', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works' },
    { title: 'Overview of HTTP', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview' },
    { title: 'HTTP response status codes', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status' },
  ],
  'rest-apis': [
    { title: 'Architectural Styles… cap. 5: REST (tesis original)', publisher: 'Roy T. Fielding, UC Irvine', url: 'https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm' },
    { title: 'RFC 9110: HTTP Semantics (métodos, idempotencia, códigos)', publisher: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc9110.html' },
    { title: 'HTTP request methods', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods' },
  ],
  sql: [
    { title: 'Tutorial de SQL', publisher: 'Documentación oficial de PostgreSQL', url: 'https://www.postgresql.org/docs/current/tutorial.html' },
    { title: 'Indexes', publisher: 'Documentación oficial de PostgreSQL', url: 'https://www.postgresql.org/docs/current/indexes.html' },
  ],
  nosql: [
    { title: 'Data Modeling', publisher: 'Documentación oficial de MongoDB', url: 'https://www.mongodb.com/docs/manual/data-modeling/' },
    { title: 'Documentación de Redis', publisher: 'Redis', url: 'https://redis.io/docs/latest/' },
    { title: 'CAP Twelve Years Later: How the "Rules" Have Changed', publisher: 'Eric Brewer (autor del teorema CAP) en InfoQ', url: 'https://www.infoq.com/articles/cap-twelve-years-later-how-the-rules-have-changed/' },
  ],
  auth: [
    { title: 'Authentication Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html' },
    { title: 'Password Storage Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html' },
    { title: 'RFC 7519: JSON Web Token (JWT)', publisher: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc7519.html' },
    { title: 'OAuth 2.0', publisher: 'oauth.net', url: 'https://oauth.net/2/' },
  ],
  caching: [
    { title: 'HTTP caching', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching' },
    { title: 'Caching Best Practices', publisher: 'Amazon Web Services', url: 'https://aws.amazon.com/caching/best-practices/' },
  ],
  'web-security': [
    { title: 'OWASP Top Ten', publisher: 'OWASP', url: 'https://owasp.org/projects/top-ten' },
    { title: 'SQL Injection Prevention Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html' },
    { title: 'Cross Site Scripting Prevention Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html' },
    { title: 'Cross-Site Request Forgery Prevention Cheat Sheet', publisher: 'OWASP', url: 'https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html' },
    { title: 'Cross-Origin Resource Sharing (CORS)', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS' },
  ],

  /* ---------- Sistemas y herramientas ---------- */
  'processes-threads': [OSTEP, { title: 'threading', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/threading.html' }],
  concurrency: [OSTEP, { title: 'threading (Lock, Semaphore)', publisher: 'Documentación oficial de Python', url: 'https://docs.python.org/3/library/threading.html' }],
  networking: [
    { title: 'RFC 9293: Transmission Control Protocol (TCP)', publisher: 'IETF', url: 'https://www.rfc-editor.org/rfc/rfc9293.html' },
    { title: 'DNS', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Glossary/DNS' },
  ],
  git: [
    { title: 'Pro Git (libro oficial, disponible en español)', publisher: 'Scott Chacon y Ben Straub — git-scm.com', url: 'https://git-scm.com/book/en/v2' },
    { title: 'Referencia de comandos', publisher: 'Documentación oficial de Git', url: 'https://git-scm.com/docs' },
  ],
  linux: [
    { title: 'The Linux Command Line (libro gratuito)', publisher: 'William Shotts', url: 'https://linuxcommand.org/tlcl.php' },
    { title: 'Linux man pages', publisher: 'man7.org — Michael Kerrisk (mantenedor de las man pages de Linux)', url: 'https://man7.org/linux/man-pages/' },
  ],
  'docker-cloud': [
    { title: 'What is Docker?', publisher: 'Documentación oficial de Docker', url: 'https://docs.docker.com/get-started/docker-overview/' },
    { title: 'SP 800-145: The NIST Definition of Cloud Computing (IaaS, PaaS, SaaS)', publisher: 'NIST (gobierno de EE. UU.)', url: 'https://csrc.nist.gov/pubs/sp/800/145/final' },
  ],
  'javascript-essentials': [
    { title: 'Closures', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures' },
    { title: 'Equality comparisons and sameness', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Equality_comparisons_and_sameness' },
    { title: 'let (ámbito de bloque y zona muerta temporal)', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let' },
    { title: 'In depth: Microtasks and the JavaScript runtime environment', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API/Microtask_guide' },
    { title: 'Using promises', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises' },
    { title: 'async function', publisher: 'MDN Web Docs (Mozilla)', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function' },
  ],
  'system-design-intro': [
    { title: 'AWS Well-Architected Framework', publisher: 'Amazon Web Services', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
    { title: 'Site Reliability Engineering (libro gratuito)', publisher: 'Google', url: 'https://sre.google/sre-book/table-of-contents/' },
    { title: 'Designing Data-Intensive Applications', publisher: 'Martin Kleppmann (O\'Reilly)', url: 'https://dataintensive.net/' },
  ],
  'behavioral-star': [
    { title: 'The STAR Method for Behavioral Interviews', publisher: 'MIT Career Advising & Professional Development', url: 'https://capd.mit.edu/resources/the-star-method-for-behavioral-interviews/' },
    { title: 'Structured Interviews', publisher: 'U.S. Office of Personnel Management (gobierno de EE. UU.)', url: 'https://www.opm.gov/policy-data-oversight/assessment-and-selection/other-assessment-methods/structured-interviews/' },
  ],
  cicd: [
    { title: 'Continuous Integration', publisher: 'Martin Fowler', url: 'https://martinfowler.com/articles/continuousIntegration.html' },
    { title: 'GitHub Actions', publisher: 'Documentación oficial de GitHub', url: 'https://docs.github.com/en/actions' },
  ],
};
