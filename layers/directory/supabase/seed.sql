-- Sample data for directory_groups
INSERT INTO directory_groups (id, name, description) VALUES
(uuid_generate_v4(), 'Technology', 'Technology resources and tools'),
(uuid_generate_v4(), 'Design', 'Design resources and inspiration'),
(uuid_generate_v4(), 'Operations', 'DevOps and operational resources'),
(uuid_generate_v4(), 'Security', 'Security tools and best practices'),
(uuid_generate_v4(), 'Research', 'Research papers and academic resources'),
(uuid_generate_v4(), 'Finance', 'Financial tools and resources'),
(uuid_generate_v4(), 'Creative', 'Creative tools and inspiration'),
(uuid_generate_v4(), 'Marketing', 'Marketing resources and strategies'),
(uuid_generate_v4(), 'Education', 'Educational resources and courses');

-- Get the IDs of the inserted groups for later use
DO $$
DECLARE
    technology_id UUID;
    design_id UUID;
    operations_id UUID;
    security_id UUID;
    research_id UUID;
    finance_id UUID;
    creative_id UUID;
    marketing_id UUID;
    education_id UUID;
    vuejs_id UUID := uuid_generate_v4();
    nuxtjs_id UUID := uuid_generate_v4();
    tailwindcss_id UUID := uuid_generate_v4();
    typescript_id UUID := uuid_generate_v4();
    figma_id UUID := uuid_generate_v4();
    docker_id UUID := uuid_generate_v4();
    tensorflow_id UUID := uuid_generate_v4();
    supabase_id UUID := uuid_generate_v4();
    kubernetes_id UUID := uuid_generate_v4();
    react_id UUID := uuid_generate_v4();
    aws_id UUID := uuid_generate_v4();
    ethereum_id UUID := uuid_generate_v4();
    nextjs_id UUID := uuid_generate_v4();
    vite_id UUID := uuid_generate_v4();
    flutter_id UUID := uuid_generate_v4();
    python_id UUID := uuid_generate_v4();
    nodejs_id UUID := uuid_generate_v4();
    mongodb_id UUID := uuid_generate_v4();
    graphql_id UUID := uuid_generate_v4();
    rust_id UUID := uuid_generate_v4();
    go_id UUID := uuid_generate_v4();
    svelte_id UUID := uuid_generate_v4();
    angular_id UUID := uuid_generate_v4();
    postgresql_id UUID := uuid_generate_v4();
    redis_id UUID := uuid_generate_v4();
    unity_id UUID := uuid_generate_v4();
    unreal_id UUID := uuid_generate_v4();
    threejs_id UUID := uuid_generate_v4();
    blender_id UUID := uuid_generate_v4();
    firebase_id UUID := uuid_generate_v4();
    vercel_id UUID := uuid_generate_v4();
    github_id UUID := uuid_generate_v4();
    
    -- Also declare tag variables
    development_id UUID;
    web_id UUID;
    ui_id UUID;
    ux_id UUID;
    mobile_id UUID;
    data_id UUID;
    science_id UUID;
    ai_id UUID;
    devops_id UUID;
    cicd_id UUID;
    cloud_id UUID;
    infrastructure_id UUID;
    security_tag_id UUID;
    privacy_id UUID;
    blockchain_id UUID;
    crypto_id UUID;
    frontend_id UUID;
    backend_id UUID;
    database_id UUID;
    api_id UUID;
    opensource_id UUID;
    tools_id UUID;
    tutorial_id UUID;
    guide_id UUID;
    framework_id UUID;
    library_id UUID;
BEGIN
    -- Get group IDs
    SELECT id INTO technology_id FROM directory_groups WHERE name = 'Technology';
    SELECT id INTO design_id FROM directory_groups WHERE name = 'Design';
    SELECT id INTO operations_id FROM directory_groups WHERE name = 'Operations';
    SELECT id INTO security_id FROM directory_groups WHERE name = 'Security';
    SELECT id INTO research_id FROM directory_groups WHERE name = 'Research';
    SELECT id INTO finance_id FROM directory_groups WHERE name = 'Finance';
    SELECT id INTO creative_id FROM directory_groups WHERE name = 'Creative';
    SELECT id INTO marketing_id FROM directory_groups WHERE name = 'Marketing';
    SELECT id INTO education_id FROM directory_groups WHERE name = 'Education';

    -- Sample data for directory_tags
    INSERT INTO directory_tags (id, name) VALUES
    (uuid_generate_v4(), 'Development'),
    (uuid_generate_v4(), 'Web'),
    (uuid_generate_v4(), 'UI'),
    (uuid_generate_v4(), 'UX'),
    (uuid_generate_v4(), 'Mobile'),
    (uuid_generate_v4(), 'Data'),
    (uuid_generate_v4(), 'Science'),
    (uuid_generate_v4(), 'AI'),
    (uuid_generate_v4(), 'DevOps'),
    (uuid_generate_v4(), 'CI/CD'),
    (uuid_generate_v4(), 'Cloud'),
    (uuid_generate_v4(), 'Infrastructure'),
    (uuid_generate_v4(), 'Security'),
    (uuid_generate_v4(), 'Privacy'),
    (uuid_generate_v4(), 'Blockchain'),
    (uuid_generate_v4(), 'Crypto'),
    (uuid_generate_v4(), 'Frontend'),
    (uuid_generate_v4(), 'Backend'),
    (uuid_generate_v4(), 'Database'),
    (uuid_generate_v4(), 'API'),
    (uuid_generate_v4(), 'Open Source'),
    (uuid_generate_v4(), 'Tools'),
    (uuid_generate_v4(), 'Tutorial'),
    (uuid_generate_v4(), 'Guide'),
    (uuid_generate_v4(), 'Framework'),
    (uuid_generate_v4(), 'Library');

    -- Get tag IDs
    SELECT id INTO development_id FROM directory_tags WHERE name = 'Development';
    SELECT id INTO web_id FROM directory_tags WHERE name = 'Web';
    SELECT id INTO ui_id FROM directory_tags WHERE name = 'UI';
    SELECT id INTO ux_id FROM directory_tags WHERE name = 'UX';
    SELECT id INTO mobile_id FROM directory_tags WHERE name = 'Mobile';
    SELECT id INTO data_id FROM directory_tags WHERE name = 'Data';
    SELECT id INTO science_id FROM directory_tags WHERE name = 'Science';
    SELECT id INTO ai_id FROM directory_tags WHERE name = 'AI';
    SELECT id INTO devops_id FROM directory_tags WHERE name = 'DevOps';
    SELECT id INTO cicd_id FROM directory_tags WHERE name = 'CI/CD';
    SELECT id INTO cloud_id FROM directory_tags WHERE name = 'Cloud';
    SELECT id INTO infrastructure_id FROM directory_tags WHERE name = 'Infrastructure';
    SELECT id INTO security_tag_id FROM directory_tags WHERE name = 'Security';
    SELECT id INTO privacy_id FROM directory_tags WHERE name = 'Privacy';
    SELECT id INTO blockchain_id FROM directory_tags WHERE name = 'Blockchain';
    SELECT id INTO crypto_id FROM directory_tags WHERE name = 'Crypto';
    SELECT id INTO frontend_id FROM directory_tags WHERE name = 'Frontend';
    SELECT id INTO backend_id FROM directory_tags WHERE name = 'Backend';
    SELECT id INTO database_id FROM directory_tags WHERE name = 'Database';
    SELECT id INTO api_id FROM directory_tags WHERE name = 'API';
    SELECT id INTO opensource_id FROM directory_tags WHERE name = 'Open Source';
    SELECT id INTO tools_id FROM directory_tags WHERE name = 'Tools';
    SELECT id INTO tutorial_id FROM directory_tags WHERE name = 'Tutorial';
    SELECT id INTO guide_id FROM directory_tags WHERE name = 'Guide';
    SELECT id INTO framework_id FROM directory_tags WHERE name = 'Framework';
    SELECT id INTO library_id FROM directory_tags WHERE name = 'Library';

    -- Sample data for directory_items with dynamic UUIDs
    -- Insert directory items
    INSERT INTO directory_items (
      id, 
      title, 
      description, 
      content, 
      image_url, 
      thumbnail_url, 
      url, 
      featured, 
      status, 
      views_count, 
      likes_count, 
      published_at
    ) VALUES
    (
      vuejs_id,
      'Vue.js - The Progressive JavaScript Framework',
      'An approachable, performant and versatile framework for building web user interfaces.',
      'Vue.js is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries.',
      'https://images.unsplash.com/photo-1607706189992-eae578626c86',
      'https://images.unsplash.com/photo-1607706189992-eae578626c86?w=400&h=300&fit=crop',
      'https://vuejs.org/',
      TRUE,
      'published',
      1250,
      342,
      NOW()
    ),
    (
      nuxtjs_id,
      'Nuxt.js - The Intuitive Vue Framework',
      'Build your next Vue.js application with confidence using Nuxt. An open source framework making web development simple and powerful.',
      'Nuxt is a free and open-source framework with an intuitive and extendable way to create type-safe, performant and production-grade full-stack web applications and websites with Vue.js.',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'https://nuxt.com/',
      TRUE,
      'published',
      980,
      256,
      NOW()
    ),
    (
      tailwindcss_id,
      'Tailwind CSS - A Utility-First CSS Framework',
      'Rapidly build modern websites without ever leaving your HTML.',
      'Tailwind CSS is a utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup. It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.',
      'https://images.unsplash.com/photo-1621839673705-6617adf9e890',
      'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=300&fit=crop',
      'https://tailwindcss.com/',
      FALSE,
      'published',
      1560,
      420,
      NOW()
    ),
    (
      typescript_id,
      'TypeScript - JavaScript with syntax for types',
      'TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.',
      'TypeScript is a strongly typed programming language which builds on JavaScript giving you better tooling at any scale. It adds additional syntax to JavaScript to support a tighter integration with your editor. Catch errors early in your editor and write JavaScript with confidence.',
      'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667',
      'https://images.unsplash.com/photo-1599507593499-a3f7d7d97667?w=400&h=300&fit=crop',
      'https://www.typescriptlang.org/',
      FALSE,
      'published',
      890,
      210,
      NOW()
    ),
    (
      figma_id,
      'Figma - The collaborative interface design tool',
      'Figma is a vector graphics editor and prototyping tool which is primarily web-based.',
      'Figma helps teams create, test, and ship better designs from start to finish. Bring designs to life with prototypes, gather feedback, and hand off to development all in one place.',
      'https://images.unsplash.com/photo-1613791049624-eb2402fc9095',
      'https://images.unsplash.com/photo-1613791049624-eb2402fc9095?w=400&h=300&fit=crop',
      'https://www.figma.com/',
      TRUE,
      'published',
      2100,
      560,
      NOW()
    ),
    (
      docker_id,
      'Docker - Develop, Ship, and Run Anywhere',
      'Docker is a platform for developers and sysadmins to build, run, and share applications with containers.',
      'Docker enables you to separate your applications from your infrastructure so you can deliver software quickly. With Docker, you can manage your infrastructure in the same ways you manage your applications.',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b',
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop',
      'https://www.docker.com/',
      FALSE,
      'published',
      1320,
      380,
      NOW()
    ),
    (
      tensorflow_id,
      'TensorFlow - An end-to-end open source machine learning platform',
      'TensorFlow is a free and open-source software library for machine learning and artificial intelligence.',
      'TensorFlow is an end-to-end open source platform for machine learning. It has a comprehensive, flexible ecosystem of tools, libraries, and community resources that lets researchers push the state-of-the-art in ML and developers easily build and deploy ML-powered applications.',
      'https://images.unsplash.com/photo-1677442135136-760c813a743d',
      'https://images.unsplash.com/photo-1677442135136-760c813a743d?w=400&h=300&fit=crop',
      'https://www.tensorflow.org/',
      FALSE,
      'published',
      760,
      190,
      NOW()
    ),
    (
      supabase_id,
      'Supabase - The Open Source Firebase Alternative',
      'Supabase is an open source Firebase alternative. Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.',
      'Supabase is an open source Firebase alternative providing all the backend features you need to build a product. It gives you a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, and Storage.',
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
      'https://supabase.com/',
      TRUE,
      'published',
      1450,
      410,
      NOW()
    ),
    (
      kubernetes_id,
      'Kubernetes - Production-Grade Container Orchestration',
      'Kubernetes, also known as K8s, is an open-source system for automating deployment, scaling, and management of containerized applications.',
      'Kubernetes is an open-source container-orchestration system for automating computer application deployment, scaling, and management. It was originally designed by Google and is now maintained by the Cloud Native Computing Foundation.',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
      'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=400&h=300&fit=crop',
      'https://kubernetes.io/',
      FALSE,
      'published',
      980,
      230,
      NOW()
    ),
    (
      react_id,
      'React - A JavaScript library for building user interfaces',
      'React makes it painless to create interactive UIs. Design simple views for each state in your application.',
      'React is a JavaScript library for building user interfaces. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications.',
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2',
      'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&h=300&fit=crop',
      'https://reactjs.org/',
      FALSE,
      'published',
      1870,
      520,
      NOW()
    ),
    (
      aws_id,
      'AWS - Amazon Web Services',
      'Amazon Web Services offers reliable, scalable, and inexpensive cloud computing services.',
      'Amazon Web Services (AWS) is a subsidiary of Amazon providing on-demand cloud computing platforms and APIs to individuals, companies, and governments, on a metered pay-as-you-go basis.',
      'https://images.unsplash.com/photo-1607292676221-1a91fde9c4c2',
      'https://images.unsplash.com/photo-1607292676221-1a91fde9c4c2?w=400&h=300&fit=crop',
      'https://aws.amazon.com/',
      TRUE,
      'published',
      1650,
      390,
      NOW()
    ),
    (
      ethereum_id,
      'Ethereum - A global, open-source platform for decentralized applications',
      'Ethereum is a decentralized, open-source blockchain with smart contract functionality.',
      'Ethereum is a decentralized, open-source blockchain with smart contract functionality. Ether is the native cryptocurrency of the platform. After Bitcoin, it is the second-largest cryptocurrency by market capitalization.',
      'https://images.unsplash.com/photo-1639762681057-408e52192e55',
      'https://images.unsplash.com/photo-1639762681057-408e52192e55?w=400&h=300&fit=crop',
      'https://ethereum.org/',
      FALSE,
      'published',
      920,
      240,
      NOW()
    ),
    (
      nextjs_id,
      'Next.js - The React Framework for Production',
      'Next.js gives you the best developer experience with all the features you need for production.',
      'Next.js enables you to create full-stack web applications by extending the latest React features. It provides a powerful combination of features like hybrid static & server rendering, TypeScript support, smart bundling, route pre-fetching, and more.',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec',
      'https://images.unsplash.com/photo-1618477388954-7852f32655ec?w=400&h=300&fit=crop',
      'https://nextjs.org/',
      TRUE,
      'published',
      1800,
      450,
      NOW()
    ),
    (
      vite_id,
      'Vite - Next Generation Frontend Tooling',
      'Next generation frontend tooling.',
      'Vite is a build tool that aims to provide a faster and leaner development experience for modern web projects.',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop',
      'https://vitejs.dev/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      flutter_id,
      'Flutter - The UI software development kit',
      'Flutter is Google''s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
      'Flutter is Google''s UI toolkit for building beautiful, natively compiled applications for mobile, web, and desktop from a single codebase.',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
      'https://flutter.dev/',
      FALSE,
      'published',
      1500,
      375,
      NOW()
    ),
    (
      python_id,
      'Python - An interpreted, high-level, general-purpose programming language',
      'Python is an interpreted, high-level, general-purpose programming language.',
      'Python is an interpreted, high-level, general-purpose programming language. Its design philosophy emphasizes code readability, and its syntax allows programmers to express concepts in fewer lines of code than would be possible in languages such as C++ or Java.',
      'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8',
      'https://images.unsplash.com/photo-1526379879527-8559ecfcb0c8?w=400&h=300&fit=crop',
      'https://www.python.org/',
      FALSE,
      'published',
      1000,
      250,
      NOW()
    ),
    (
      nodejs_id,
      'Node.js - An asynchronous event-driven JavaScript runtime',
      'Node.js is a JavaScript runtime built on Chrome''s V8 JavaScript engine.',
      'Node.js is a JavaScript runtime built on Chrome''s V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient. Node.js''s package ecosystem, npm, is the largest ecosystem of open source libraries in the world.',
      'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3',
      'https://images.unsplash.com/photo-1589149098258-3e9102cd63d3?w=400&h=300&fit=crop',
      'https://nodejs.org/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      mongodb_id,
      'MongoDB - A document database',
      'MongoDB is a document database. Database documents are JSON-like structures with the flexibility of a schema.',
      'MongoDB is a document database. Database documents are JSON-like structures with the flexibility of a schema. MongoDB is a NoSQL database that provides high performance, high availability, and automatic scaling.',
      'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6',
      'https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?w=400&h=300&fit=crop',
      'https://www.mongodb.com/',
      FALSE,
      'published',
      1000,
      250,
      NOW()
    ),
    (
      graphql_id,
      'GraphQL - A query language for APIs',
      'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.',
      'GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data. GraphQL provides a complete and understandable description of the data in your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs over time, and enables powerful developer tools.',
      'https://images.unsplash.com/photo-1547658719-da2b51169166',
      'https://images.unsplash.com/photo-1547658719-da2b51169166?w=400&h=300&fit=crop',
      'https://graphql.org/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      rust_id,
      'Rust - A systems programming language',
      'Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety.',
      'Rust is a systems programming language that runs blazingly fast, prevents segfaults, and guarantees thread safety. It runs on Windows, macOS, and Linux, and is suitable for a wide range of use cases.',
      'https://images.unsplash.com/photo-1610986603166-f78428624e76',
      'https://images.unsplash.com/photo-1610986603166-f78428624e76?w=400&h=300&fit=crop',
      'https://www.rust-lang.org/',
      FALSE,
      'published',
      1500,
      375,
      NOW()
    ),
    (
      go_id,
      'Go - An open source programming language that makes it easy to build simple, reliable, and efficient software',
      'Go is an open source programming language that makes it easy to build simple, reliable, and efficient software.',
      'Go is an open source programming language that makes it easy to build simple, reliable, and efficient software. It is strongly typed and has garbage collection, making it ideal for systems programming.',
      'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4',
      'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?w=400&h=300&fit=crop',
      'https://golang.org/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      svelte_id,
      'Svelte - The fastest way to build web applications',
      'Svelte is a radical new approach to building web applications.',
      'Svelte is a radical new approach to building web applications. It is a compiler that takes your declarative components and converts them into efficient JavaScript that surgically updates the DOM.',
      'https://images.unsplash.com/photo-1544982877-f0f4427dee5c',
      'https://images.unsplash.com/photo-1544982877-f0f4427dee5c?w=400&h=300&fit=crop',
      'https://svelte.dev/',
      FALSE,
      'published',
      1000,
      250,
      NOW()
    ),
    (
      angular_id,
      'Angular - A platform for building mobile and desktop web applications',
      'Angular is a platform for building mobile and desktop web applications.',
      'Angular is a platform for building mobile and desktop web applications. It is a TypeScript-based, free and open-source web application framework led by the Angular Team at Google and by a community of individuals and corporations. Angular is a complete rewrite from the same team that built AngularJS.',
      'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521',
      'https://images.unsplash.com/photo-1617040619263-41c5a9ca7521?w=400&h=300&fit=crop',
      'https://angular.io/',
      FALSE,
      'published',
      1500,
      375,
      NOW()
    ),
    (
      postgresql_id,
      'PostgreSQL - The world''s most advanced open source database',
      'PostgreSQL is a powerful, open source object-relational database system.',
      'PostgreSQL is a powerful, open source object-relational database system. It is fully ACID compliant, has full support for international text, including UTF8, and is extensible by adding new data types and functions.',
      'https://images.unsplash.com/photo-1555529771-122e5d9f2341',
      'https://images.unsplash.com/photo-1555529771-122e5d9f2341?w=400&h=300&fit=crop',
      'https://www.postgresql.org/',
      FALSE,
      'published',
      1000,
      250,
      NOW()
    ),
    (
      redis_id,
      'Redis - An in-memory data structure store',
      'Redis is an in-memory data structure store, used as a database, cache, and message broker.',
      'Redis is an in-memory data structure store, used as a database, cache, and message broker. It is often referred to as a data structures server since the data structures, not just strings, are the primary focus.',
      'https://images.unsplash.com/photo-1599658880436-c61792e70672',
      'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=400&h=300&fit=crop',
      'https://redis.io/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      unity_id,
      'Unity - A cross-platform game development platform',
      'Unity is a cross-platform game development platform.',
      'Unity is a cross-platform game development platform. It is used to develop games and interactive content, including mobile, desktop, VR and AR applications.',
      'https://images.unsplash.com/photo-1611262588024-d12430b98920',
      'https://images.unsplash.com/photo-1611262588024-d12430b98920?w=400&h=300&fit=crop',
      'https://unity.com/',
      FALSE,
      'published',
      1500,
      375,
      NOW()
    ),
    (
      unreal_id,
      'Unreal Engine - A game development platform',
      'Unreal Engine is a game development platform.',
      'Unreal Engine is a game development platform. It is used to develop games, films, and interactive experiences.',
      'https://images.unsplash.com/photo-1576495169018-bd2414046c6b',
      'https://images.unsplash.com/photo-1576495169018-bd2414046c6b?w=400&h=300&fit=crop',
      'https://www.unrealengine.com/',
      FALSE,
      'published',
      1800,
      450,
      NOW()
    ),
    (
      threejs_id,
      'Three.js - JavaScript 3D Library',
      'Three.js is a cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser using WebGL.',
      'Three.js is a cross-browser JavaScript library and application programming interface used to create and display animated 3D computer graphics in a web browser using WebGL.',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2?w=400&h=300&fit=crop',
      'https://threejs.org/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      blender_id,
      'Blender - A 3D modeling and animation software',
      'Blender is a 3D modeling and animation software.',
      'Blender is a 3D modeling and animation software. It is used for creating 3D models, animations, and interactive content.',
      'https://images.unsplash.com/photo-1638668236042-a4b1cff175fe',
      'https://images.unsplash.com/photo-1638668236042-a4b1cff175fe?w=400&h=300&fit=crop',
      'https://www.blender.org/',
      FALSE,
      'published',
      1000,
      250,
      NOW()
    ),
    (
      firebase_id,
      'Firebase - A mobile and web application development platform',
      'Firebase is a mobile and web application development platform.',
      'Firebase is a mobile and web application development platform. It provides tools to develop high-quality apps and grow your business.',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf',
      'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=400&h=300&fit=crop',
      'https://firebase.google.com/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    ),
    (
      vercel_id,
      'Vercel - The platform for frontend developers',
      'Vercel is a platform for frontend developers.',
      'Vercel is a platform for frontend developers. It provides tools to build, deploy, and scale modern web projects.',
      'https://images.unsplash.com/photo-1642059617693-ae8d75acfc4d',
      'https://images.unsplash.com/photo-1642059617693-ae8d75acfc4d?w=400&h=300&fit=crop',
      'https://vercel.com/',
      FALSE,
      'published',
      1000,
      250,
      NOW()
    ),
    (
      github_id,
      'GitHub - A development platform for version control and collaboration',
      'GitHub is a development platform for version control and collaboration.',
      'GitHub is a development platform for version control and collaboration. It lets you and others work together on projects from anywhere.',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb',
      'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400&h=300&fit=crop',
      'https://github.com/',
      FALSE,
      'published',
      1200,
      300,
      NOW()
    );

    -- Sample data for directory_items_groups (relationships between items and groups)
    INSERT INTO directory_items_groups (item_id, group_id) VALUES
    (vuejs_id, technology_id),
    (vuejs_id, creative_id),
    (nuxtjs_id, technology_id),
    (tailwindcss_id, technology_id),
    (tailwindcss_id, design_id),
    (typescript_id, technology_id),
    (figma_id, design_id),
    (figma_id, creative_id),
    (docker_id, technology_id),
    (docker_id, operations_id),
    (tensorflow_id, technology_id),
    (tensorflow_id, research_id),
    (supabase_id, technology_id),
    (kubernetes_id, technology_id),
    (kubernetes_id, operations_id),
    (react_id, technology_id),
    (aws_id, technology_id),
    (aws_id, operations_id),
    (ethereum_id, technology_id),
    (ethereum_id, finance_id),
    (nextjs_id, technology_id),
    (nextjs_id, creative_id),
    (vite_id, technology_id),
    (vite_id, operations_id),
    (flutter_id, technology_id),
    (flutter_id, creative_id),
    (python_id, technology_id),
    (python_id, research_id),
    (nodejs_id, technology_id),
    (nodejs_id, operations_id),
    (mongodb_id, technology_id),
    (mongodb_id, operations_id),
    (graphql_id, technology_id),
    (rust_id, technology_id),
    (rust_id, operations_id),
    (go_id, technology_id),
    (go_id, operations_id),
    (svelte_id, technology_id),
    (svelte_id, creative_id),
    (angular_id, technology_id),
    (postgresql_id, technology_id),
    (postgresql_id, operations_id),
    (redis_id, technology_id),
    (redis_id, operations_id),
    (unity_id, technology_id),
    (unity_id, creative_id),
    (unreal_id, technology_id),
    (unreal_id, creative_id),
    (threejs_id, technology_id),
    (threejs_id, creative_id),
    (blender_id, creative_id),
    (blender_id, design_id),
    (firebase_id, technology_id),
    (firebase_id, operations_id),
    (vercel_id, technology_id),
    (vercel_id, operations_id),
    (github_id, technology_id),
    (github_id, operations_id);

    -- Sample data for directory_items_tags (relationships between items and tags)
    INSERT INTO directory_items_tags (item_id, tag_id) VALUES
    (vuejs_id, development_id),
    (vuejs_id, web_id),
    (vuejs_id, frontend_id),
    (vuejs_id, framework_id),
    (nuxtjs_id, development_id),
    (nuxtjs_id, web_id),
    (nuxtjs_id, frontend_id),
    (nuxtjs_id, framework_id),
    (tailwindcss_id, web_id),
    (tailwindcss_id, ui_id),
    (typescript_id, development_id),
    (typescript_id, web_id),
    (figma_id, ui_id),
    (figma_id, ux_id),
    (figma_id, tools_id),
    (docker_id, devops_id),
    (docker_id, infrastructure_id),
    (tensorflow_id, data_id),
    (tensorflow_id, science_id),
    (tensorflow_id, ai_id),
    (supabase_id, development_id),
    (supabase_id, web_id),
    (supabase_id, backend_id),
    (supabase_id, database_id),
    (kubernetes_id, devops_id),
    (kubernetes_id, cloud_id),
    (kubernetes_id, infrastructure_id),
    (react_id, development_id),
    (react_id, web_id),
    (react_id, frontend_id),
    (react_id, library_id),
    (aws_id, cloud_id),
    (aws_id, infrastructure_id),
    (ethereum_id, blockchain_id),
    (ethereum_id, crypto_id),
    (nextjs_id, development_id),
    (nextjs_id, web_id),
    (nextjs_id, frontend_id),
    (nextjs_id, framework_id),
    (vite_id, development_id),
    (vite_id, tools_id),
    (vite_id, frontend_id),
    (flutter_id, development_id),
    (flutter_id, mobile_id),
    (flutter_id, framework_id),
    (python_id, development_id),
    (python_id, backend_id),
    (python_id, data_id),
    (python_id, science_id),
    (nodejs_id, development_id),
    (nodejs_id, backend_id),
    (nodejs_id, infrastructure_id),
    (mongodb_id, database_id),
    (mongodb_id, backend_id),
    (graphql_id, api_id),
    (graphql_id, backend_id),
    (graphql_id, development_id),
    (rust_id, development_id),
    (rust_id, infrastructure_id),
    (go_id, development_id),
    (go_id, backend_id),
    (go_id, infrastructure_id),
    (svelte_id, development_id),
    (svelte_id, frontend_id),
    (svelte_id, framework_id),
    (angular_id, development_id),
    (angular_id, frontend_id),
    (angular_id, framework_id),
    (postgresql_id, database_id),
    (postgresql_id, backend_id),
    (redis_id, database_id),
    (redis_id, backend_id),
    (redis_id, infrastructure_id),
    (unity_id, development_id),
    (unity_id, tools_id),
    (unity_id, framework_id),
    (unreal_id, development_id),
    (unreal_id, tools_id),
    (unreal_id, framework_id),
    (threejs_id, development_id),
    (threejs_id, frontend_id),
    (threejs_id, library_id),
    (blender_id, tools_id),
    (blender_id, ui_id),
    (blender_id, ux_id),
    (firebase_id, development_id),
    (firebase_id, backend_id),
    (firebase_id, cloud_id),
    (firebase_id, database_id),
    (vercel_id, development_id),
    (vercel_id, cloud_id),
    (vercel_id, infrastructure_id),
    (github_id, development_id),
    (github_id, tools_id),
    (github_id, devops_id);
END
$$; 