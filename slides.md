---
title: 'C++ Conan Package Manager - Complete Guide'
theme: 'seriph'
aspectRatio: '16/9'
canvasWidth: 980
download: true # Enables PDF download option
favicon: '/conan-logo.svg' # Use /conan-logo.svg instead of ./public/conan-logo.svg for favicon and image paths
info: |
  Presentation on C++ Conan Package Manager.
  Covers introduction, installation, usage, advanced topics, and best practices.

# Global configurations
drawings:
  enabled: 'dev' # Enable drawings in dev mode

# Enable slide numbers and progress bar
slideNo: true
progressBar: true
---

---
# Title Slide
layout: cover
class: 'text-center' # Center align content
# Placeholder for animated background - would require a custom layout or component
# style: |
#  background-image: url('./public/animated-cpp-background.svg');
#  background-size: cover;
#  background-repeat: no-repeat;
---

<!--
TODO:
- Add actual Conan logo to ./public/conan-logo.svg
- Implement animated background with C++ code snippets.
  This might involve creating a custom layout in `layouts/`
  or a Vue component in `components/` that uses CSS animations
  or a JavaScript library to animate code snippets.
-->

<div class="my-auto w-full">
  <img src="/conan-logo.svg" alt="Conan Logo" class="h-40 mx-auto mb-8" />
  <!-- Fallback text if image is not found for now: <p class="text-6xl">📦</p> -->
  <h1 class="text-6xl font-bold text-white">
    C++ <span class="accent-text-cyan">Conan</span> Package Manager
  </h1>
  <p class="text-3xl mt-2 mb-12 text-gray-200">A Complete Guide</p>
  <div class="mt-10">
    <p class="text-xl font-light text-gray-300">
      Presented by: Jules (AI Assistant)
    </p>
    <p class="text-lg font-light text-gray-400">
      Date: October 26, 2023 (Placeholder)
    </p>
    <p class="text-lg font-light text-gray-400">
      Venue: Virtual (Generated Presentation)
    </p>
  </div>
</div>

---
layout: default
---


# 15. Performance & Optimization
## Speeding Up Your Conan Workflows

<div class="mt-4">
  <p class="text-lg text-center mb-6">
    While Conan significantly simplifies dependency management, large projects with many dependencies can still face build time challenges. Here are strategies to optimize performance.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">1. Cache Management</h3>
      <p class="text-gray-300">
        Conan's local cache (<code class="text-orange-400">~/.conan2/p/</code> for packages in 2.x) stores downloaded and built packages.
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
        <li><strong>Cleaning Cache:</strong> Remove specific packages or everything.
          <pre><code class="language-bash">
          # Remove all packages (use with caution!)
          # conan remove "*" -c
          # Remove specific package/version binaries
          conan remove mylib/0.1.0 --packages -c
          </code></pre>
        </li>
        <li><strong>Download Cache:</strong> Set <code class="text-orange-400">CONAN_DOWNLOAD_CACHE</code> environment variable to a path. Conan will store downloaded archives there, potentially shared across multiple Conan home directories or CI agents to save redownloading.
          <pre><code class="language-bash">
          export CONAN_DOWNLOAD_CACHE=/path/to/shared_conan_downloads
          </code></pre>
        </li>
         <li><strong>Short Paths (Windows):</strong> For very long paths on Windows that might exceed MAX_PATH, Conan 2.x handles this better internally. If issues persist, <code class="text-orange-400">CONAN_USER_HOME_SHORT</code> can be an option, but it's less common now.</li>
      </ul>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">2. Binary Package Optimization</h3>
      <p class="text-gray-300">
        Building from source is time-consuming. Prioritize using pre-built binaries.
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
        <li><strong class="accent-text-cyan">Build Policies:</strong>
          <ul class="list-disc pl-5 space-y-1 text-sm text-gray-400">
            <li><code class="text-green-400">--build=missing</code> (Default): Builds only if a binary for the current configuration is not found in remotes or local cache. <span class="text-yellow-300">Usually the best balance.</span></li>
            <li><code class="text-green-400">--build=never</code>: Fails if a binary is not available. Good for ensuring only pre-built binaries are used.</li>
            <li><code class="text-green-400">--build="*"</code> or <code class="text-green-400">--build=pkgname</code>: Forces building specific or all packages from source.</li>
          </ul>
        </li>
        <li><strong class="accent-text-cyan">Private Binary Repository:</strong> Build and host binaries for your common configurations (OS, compiler, arch, build type) on your private server (Artifactory, etc.). This is the biggest time saver for teams.</li>
        <li><strong class="accent-text-cyan">Package Revisions:</strong> Enabled by default in Conan 2.x. Ensure immutability and prevent re-downloading if the recipe or binaries haven't changed.</li>
      </ul>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">3. Network & Build Time Improvements</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <h4 class="text-xl accent-text-cyan">Network Optimization</h4>
        <ul class="list-disc pl-5 space-y-1 text-gray-300">
          <li><strong>Artifactory as Proxy:</strong> Use your private repository to cache Conan Center packages. Reduces direct internet traffic and centralizes control.</li>
          <li><strong>Minimize Remotes:</strong> Fewer remotes mean fewer places to search. Prioritize your private remotes.</li>
          <li><strong>Revisions:</strong> Help avoid re-fetching unchanged packages. Ensure your server and clients support them (default in Conan 2.x).</li>
        </ul>
      </div>
      <div>
        <h4 class="text-xl accent-text-cyan">Build Time Reduction</h4>
        <ul class="list-disc pl-5 space-y-1 text-gray-300">
          <li><strong>Parallel Builds:</strong> For build systems like CMake, use parallel compilation:
            <pre><code class="language-bash">
            # For CMake, after conan install & cmake configure
            cmake --build . --parallel $(nproc) # Linux
            cmake --build . -- /MP # MSVC
            </code></pre>
          </li>
          <li><strong>Faster Compilers/Linkers:</strong> Use profiles to configure faster tools (e.g., Clang, LLD linker).
            <pre><code class="language-ini">
            # In a profile [conf] section
            tools.build:compiler_executables={"c": "clang", "cpp": "clang++"}
            tools.build:linker_scripts=["-fuse-ld=lld"] # For gcc/clang
            </code></pre>
          </li>
          <li><strong>Incremental Builds:</strong> Conan's layouts (e.g., <code class="text-green-400">cmake_layout</code>) help organize build folders, allowing build systems to perform incremental compilations effectively. Avoid unnecessary clean builds.</li>
          <li><strong>No Conan Test Folder for <code class="text-orange-400">install</code>:</strong> Use <code class="text-orange-400">conan install ... --deployer=direct_test</code> for editable mode tests, not for regular installs. The standard `test_package` is for `conan create`.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

---
layout: default
---


# 01. What is Conan?
## An Introduction to the C++ Package Manager

<div class="grid grid-cols-2 gap-8 mt-8">
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">Definition & Purpose</h3>
    <p class="text-lg">
      Conan is an <span class="accent-text-orange">open-source, decentralized, and multi-platform</span> package manager specifically designed for C++ developers.
    </p>
    <p class="mt-2 text-lg">
      Its primary purpose is to automate the management of libraries and dependencies, simplifying the process of building and sharing C++ projects.
    </p>

    <h3 class="text-2xl font-semibold accent-text-purple mt-8 mb-3">Problem Solved</h3>
    <ul class="list-disc pl-6 text-lg space-y-2">
      <li>Alleviates <strong class="accent-text-cyan">"Dependency Hell"</strong> in C++ projects.</li>
      <li>Manages complex binary compatibility issues (OS, compiler, architecture, build type).</li>
      <li>Reduces manual effort in finding, building, and linking dependencies.</li>
      <li>Promotes reusability and modularity in C++ development.</li>
    </ul>
  </div>
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">"Before Conan" vs "After Conan"</h3>
    <!-- TODO: Replace with an actual visual comparison diagram -->
    <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center">
      <p class="text-gray-400 text-sm">
        [Visual Placeholder: Diagram showing tangled dependencies and manual processes on the "Before" side, and a streamlined, automated workflow with Conan managing packages on the "After" side. Perhaps using icons for libraries, build tools, and developers.]
      </p>
      <p class="mt-4 text-2xl">🤯 vs 😎</p>
    </div>

    <h3 class="text-2xl font-semibold accent-text-purple mt-8 mb-3">Key Statistics & Adoption</h3>
    <!-- TODO: Research and add actual statistics -->
    <ul class="list-disc pl-6 text-lg space-y-2">
      <li><span class="accent-text-orange">X+ million</span> downloads on Conan Center.</li>
      <li>Used by <span class="accent-text-cyan">Y+ companies</span> worldwide.</li>
      <li>Supports <span class="accent-text-orange">Z+</span> compilers and platforms.</li>
      <li>Active community with frequent updates.</li>
    </ul>
    <p class="text-xs text-gray-500 mt-2">(Note: Statistics are illustrative placeholders)</p>
  </div>
</div>

---
layout: default
---

# 02. Why Package Management Matters
## Taming Complexity in C++ Development

<div class="grid grid-cols-2 gap-12 mt-6">
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">The Infamous "Dependency Hell"</h3>
    <p class="text-lg">
      Managing dependencies in C++ can be a nightmare due to:
    </p>
    <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
      <li>Version conflicts (e.g., Project A needs LibFoo v1.2, Project B needs LibFoo v1.5).</li>
      <li>ABI incompatibilities across different compilers, settings, or OS.</li>
      <li>Transitive dependencies: your dependencies have dependencies!</li>
      <li>Lack of a standard way to distribute and consume pre-built binaries.</li>
    </ul>
    <!-- TODO: Replace with an actual visualization -->
    <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-4 h-32 flex items-center justify-center">
      <p class="text-gray-400 text-sm">[Visual Placeholder: "Dependency Hell" - tangled web of libraries, versions, and conflicts.]</p>
    </div>
  </div>
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">Build System Complexity</h3>
    <p class="text-lg">
      Integrating third-party libraries into build systems (CMake, MSBuild, etc.) is often:
    </p>
    <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
      <li>Error-prone and time-consuming.</li>
      <li>Requires custom find-scripts or modules for each library.</li>
      <li>Hard to maintain across different platforms and toolchains.</li>
    </ul>
    <!-- TODO: Replace with an actual diagram -->
    <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-4 h-32 flex items-center justify-center">
      <p class="text-gray-400 text-sm">[Visual Placeholder: Diagram showing complex manual build script vs. simplified script with package manager integration.]</p>
    </div>
  </div>
</div>

<div class="mt-8">
  <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">The Value Proposition</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h4 class="text-xl accent-text-orange mb-2">Time Savings & Productivity</h4>
      <p class="text-gray-300">
        Automating dependency management frees up developer time to focus on core application logic rather than wrestling with libraries.
      </p>
      <!-- TODO: Replace with an infographic -->
      <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-2 h-24 flex items-center justify-center">
        <p class="text-gray-400 text-sm">[Visual Placeholder: Infographic - "Hours saved per developer per week".]</p>
      </div>
    </div>
    <div>
      <h4 class="text-xl accent-text-orange mb-2">Real-World Pain Points (Animated)</h4>
      <p class="text-gray-300">
        Imagine these scenarios (ideally animated):
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-1 text-sm text-gray-400">
        <li><span class="font-mono text-red-400">"Works on my machine!"</span> - inconsistent environments.</li>
        <li>Spending days to set up a new dev environment.</li>
        <li>Build breaks after a library updates unexpectedly.</li>
        <li>Difficulty in reproducing builds across teams or CI.</li>
      </ul>
      <p class="text-xs text-gray-500 mt-1">(These points could be revealed one by one with animation)</p>
    </div>
  </div>
</div>

---
layout: default
---

# 03. Conan Architecture Overview
## Understanding How Conan Works

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">Client-Server Model</h3>
    <p class="text-lg">
      Conan operates on a client-server architecture:
    </p>
    <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
      <li><strong>Conan Client:</strong> A command-line tool (`conan`) that runs on developer machines and CI servers. It handles package creation, consumption, and local caching.</li>
      <li><strong>Conan Server:</strong> Hosts remote repositories for packages. Can be official (Conan Center) or private (e.g., Artifactory, self-hosted Conan server).</li>
    </ul>
    <!-- TODO: Replace with an actual diagram -->
    <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-4 h-40 flex items-center justify-center">
      <p class="text-gray-400 text-sm">[Visual Placeholder: Diagram showing Conan client interacting with local cache, Conan Center, and private Conan server(s). Highlight data flow for search, download, upload.]</p>
    </div>
  </div>
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">Remotes: Conan Center & Private Repos</h3>
    <p class="text-lg">
      Packages are stored in and retrieved from remotes:
    </p>
    <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
      <li><strong class="accent-text-cyan">Conan Center:</strong> The official, public central repository for open-source C++ packages. Community-driven.</li>
      <li><strong class="accent-text-orange">Private Repositories:</strong> For proprietary packages, internal company use, or forks of public packages. Ensures control and security.
        <ul class="list-disc pl-5 space-y-1 mt-1 text-sm">
          <li>Examples: JFrog Artifactory, Sonatype Nexus, self-hosted `conan_server`.</li>
        </ul>
      </li>
    </ul>
    <p class="mt-2 text-gray-400 text-sm">
      Clients can be configured to search for packages in multiple remotes in a defined order.
    </p>
  </div>
</div>

<div class="mt-8">
  <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Package Lifecycle & Interactive View</h3>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h4 class="text-xl accent-text-cyan">Package Lifecycle</h4>
      <!-- TODO: Replace with an actual flowchart -->
      <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-2 h-48 flex items-center justify-center">
        <p class="text-gray-400 text-sm">[Visual Placeholder: Flowchart - Create (conanfile.py) -> Build -> Test -> Package -> Upload (to remote) -> Search -> Download (to local cache) -> Consume (in project).]</p>
      </div>
    </div>
    <div>
      <h4 class="text-xl accent-text-orange">Interactive Architecture Visualization</h4>
      <p class="text-gray-300">
        Ideally, this would be an interactive diagram where you could click on components (client, server, cache, specific commands) to see more details or simulate workflows.
      </p>
      <!-- TODO: Implement as an interactive Vue component -->
      <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-2 h-48 flex items-center justify-center">
        <p class="text-gray-400 text-sm">[Interactive Placeholder: Clickable elements representing client, cache, remotes, and data flows. Hover effects could show information tooltips.]</p>
      </div>
    </div>
  </div>
</div>

---
layout: default
---

# 04. Installation & Setup
## Getting Conan Up and Running

<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">1. Installation</h3>
    <p class="text-lg">Conan is a Python application, typically installed using <code class="text-orange-400">pip</code>.</p>

    <p class="mt-2 text-gray-400">Ensure you have Python (3.6+ recommended) and pip installed.</p>

    <pre><code class="language-bash">
    # Install Conan (or upgrade to the latest version)
    pip install --upgrade conan
    </code></pre>

    <p class="mt-3 text-lg">Supported Operating Systems:</p>
    <ul class="list-disc pl-6 space-y-1 text-gray-300">
      <li>Windows (various compilers like MSVC, MinGW)</li>
      <li>macOS (Apple Clang, GCC, Clang)</li>
      <li>Linux (GCC, Clang, various distributions)</li>
      <li>FreeBSD, Solaris, and others (community supported)</li>
    </ul>
     <p class="text-sm text-gray-500 mt-1">Works well within WSL on Windows too!</p>
  </div>

  <div>
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">2. Verification</h3>
    <p class="text-lg">After installation, verify it's working correctly:</p>
    <pre><code class="language-bash">
    # Check Conan version
    conan --version
    </code></pre>
    <p class="text-sm text-gray-400 mt-1 mb-2">Expected Output (example): <code class="text-green-400">Conan version 2.0.17</code></p>

    <p class="text-lg mt-4">Detect your default profile (compilers, settings):</p>
    <pre><code class="language-bash">
    # Detect host profile (compilers, OS, arch)
    # --force will overwrite existing default profile
    conan profile detect --force
    </code></pre>
    <p class="text-sm text-gray-400 mt-1">This creates/updates <code class="text-orange-400">~/.conan2/profiles/default</code> with your system's build capabilities.</p>
  </div>
</div>

<div class="mt-8">
  <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">3. Environment Setup Best Practices</h3>
  <ul class="list-disc pl-6 space-y-2 text-lg text-gray-300 max-w-3xl mx-auto">
    <li>
      <strong class="accent-text-cyan">Python Virtual Environments:</strong> Recommended to install Conan in a Python virtual environment (`venv` or `virtualenv`) to avoid conflicts with system-wide Python packages.
    </li>
    <li>
      <strong class="accent-text-cyan">PATH Configuration:</strong> Ensure the directory containing the `conan` executable is in your system's PATH. Pip usually handles this.
    </li>
    <li>
      <strong class="accent-text-cyan">Conan Home Directory:</strong> By default, Conan stores its cache, profiles, and configuration in <code class="text-orange-400">~/.conan2/</code> (for Conan 2.x). This can be customized with the <code class="text-orange-400">CONAN_USER_HOME</code> environment variable.
    </li>
    <li>
      <strong class="accent-text-cyan">Initial Configuration:</strong> Run <code class="text-orange-400">conan config init</code> if you need to start with fresh default configurations (though <code class="text-orange-400">profile detect</code> is often enough for new users).
    </li>
  </ul>
</div>

---
layout: default
---

# 05. Your First Conan Project
## Hands-On: Bringing Dependencies to Life

<div class="mt-6">
  <p class="text-xl text-center mb-6">Let's build a simple C++ application that uses external libraries (<code class="text-orange-400">fmt</code> for formatting, <code class="text-orange-400">nlohmann/json</code> for JSON manipulation) managed by Conan.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-2">Project Structure</h3>
      <!-- TODO: Replace with a proper visual tree diagram -->
      <pre><code class="language-text">
      my_project/
      ├── conanfile.txt
      ├── main.cpp
      └── build/         # Will be created during build
      </code></pre>
      <p class="text-sm text-gray-400 mt-1">A minimal project: a Conan recipe, your source code, and a build folder.</p>

      <h3 class="text-2xl font-semibold accent-text-purple mt-6 mb-2">1. The Source Code: <code class="text-green-400">main.cpp</code></h3>
      <p class="text-gray-300 mb-2">Our application will format and print a JSON object.</p>
      <pre><code class="language-cpp line-numbers">
      // main.cpp
      #include <iostream>
      #include <fmt/format.h>      // From Conan
      #include <nlohmann/json.hpp> // From Conan

      int main() {
          auto json = nlohmann::json{
              {"hello", "conan"},
              {"version", "2.0"}
          };
          std::cout << fmt::format("Formatted JSON: {}", json.dump(2));
          return 0;
      }
      </code></pre>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-2">2. The Recipe: <code class="text-green-400">conanfile.txt</code></h3>
      <p class="text-gray-300 mb-2">This file tells Conan about our project's dependencies and how to prepare the build environment.</p>
      <pre><code class="language-ini line-numbers">
      # conanfile.txt

      [requires]
      fmt/10.2.1         # Using a recent version of fmt
      nlohmann_json/3.11.3 # Using a recent version of nlohmann_json

      [generators]
      CMakeDeps          # Generates info for find_package() in CMake
      CMakeToolchain     # Generates CMake toolchain file

      [layout]
      cmake_layout       # Defines standard project layout (source, build folders)
      </code></pre>
      <p class="text-sm text-gray-400 mt-2">
        <strong class="accent-text-orange">[requires]:</strong> Lists direct dependencies. Conan fetches them from remotes. <br/>
        <strong class="accent-text-orange">[generators]:</strong> Tools that create files for build system integration. <br/>
        <strong class="accent-text-orange">[layout]:</strong> Defines project structure, e.g., where sources and build artifacts are located.
      </p>
    </div>
  </div>

  <p class="text-center text-lg mt-8 text-gray-400">
    Next, we'll look at how to build this project using CMake and these Conan files.
  </p>
</div>

---
layout: default
---

# 06. Understanding `conanfile.txt`
## Decoding Your Project's Recipe

<div class="mt-4">
  <p class="text-lg text-center mb-6">The <code class="text-orange-400">conanfile.txt</code> is the simplest way to define your project's needs for Conan. It's declarative and easy to understand.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Key Sections Breakdown</h3>
      <p class="text-gray-300 mb-2">Let's dissect a typical <code class="text-green-400">conanfile.txt</code>:</p>

      <pre><code class="language-ini line-numbers">
      [requires]
      # Defines direct dependencies for your project
      # Format: package/version[@user/channel]
      fmt/10.2.1
      zlib/1.3

      [generators]
      # Specifies build system integration files to generate
      CMakeDeps
      CMakeToolchain
      # Other examples: MSBuildDeps, MakeDeps, PkgConfigDeps

      [layout]
      # Defines the project directory structure
      cmake_layout # Common layout for CMake-based projects
      # basic_layout # Simpler layout

      [options]
      # Allows setting default options for your dependencies
      # Format: package:option=value
      # Example:
      # zlib*:shared=True # Build zlib as a shared library
      # my_lib:my_option=value
      </code></pre>
      <!-- TODO: Implement animated reveals for each section -->
      <p class="text-sm text-gray-500 mt-2">
        (These sections could be revealed one by one with explanations using Slidev animations.)
      </p>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Section Deep Dive</h3>
      <!-- This could be an interactive component or use <v-click> for reveals -->
      <div class="space-y-3">
        <div>
          <h4 class="text-xl font-semibold accent-text-cyan">[requires]</h4>
          <p class="text-gray-300 text-sm">Lists libraries your project directly depends on. Conan resolves transitive dependencies automatically. Versions can be specific, ranges, or use aliases.</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold accent-text-cyan">[generators]</h4>
          <p class="text-gray-300 text-sm">Instructs Conan to create files that help your build system locate and use the dependencies (e.g., `find_package` scripts for CMake, `.props` files for MSBuild).</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold accent-text-cyan">[layout]</h4>
          <p class="text-gray-300 text-sm">Predefined directory structures. <code class="text-orange-400">cmake_layout</code> assumes sources in project root or <code class="text-orange-400">src/</code>, build in <code class="text-orange-400">build/</code>. Simplifies build commands.</p>
        </div>
        <div>
          <h4 class="text-xl font-semibold accent-text-cyan">[options]</h4>
          <p class="text-gray-300 text-sm">Specify default values for options of your dependencies (e.g., <code class="text-orange-400">zlib:shared=True</code>) or your own project's options if it were a package.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Best Practices & Patterns</h3>
    <ul class="list-disc pl-6 space-y-2 text-gray-300 max-w-3xl mx-auto">
      <li>Be specific with versions in <code class="text-orange-400">[requires]</code> for reproducible builds, especially for applications. Libraries might use version ranges.</li>
      <li>Use <code class="text-orange-400">cmake_layout</code> (or equivalent for your build system) if your project follows a standard structure.</li>
      <li>Keep <code class="text-orange-400">conanfile.txt</code> focused on consumer aspects. For more complex logic (e.g. packaging your own library), use a <code class="text-orange-400">conanfile.py</code>.</li>
    </ul>
  </div>

  <!-- TODO: Placeholder for interactive editor simulation -->
  <div class="mt-6 border-2 border-dashed border-gray-600 p-4 rounded-lg text-center">
    <p class="text-gray-400 text-sm">[Interactive Placeholder: A mock editor showing a `conanfile.txt`. Users could click/hover on sections like `[requires]` or specific lines to see tooltips or detailed explanations of that part.]</p>
  </div>
</div>

---
layout: default
---

# 07. Package Discovery
## Finding and Inspecting Conan Packages

<div class="mt-4">
  <p class="text-lg text-center mb-6">Conan provides powerful tools to find and learn about available packages, primarily through <span class="accent-text-cyan">Conan Center</span> and command-line queries.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Exploring Conan Center</h3>
      <p class="text-gray-300 mb-2">
        <a href="https://conan.io/center/" target="_blank" class="text-cyan-400 hover:text-orange-400">Conan Center</a> is the official public repository for Conan packages. You can:
      </p>
      <ul class="list-disc pl-5 space-y-1 text-gray-300">
        <li>Search for packages by name (e.g., "fmt", "boost", "openssl").</li>
        <li>View available versions, licenses, and documentation links.</li>
        <li>See common settings, options, and dependencies for each package.</li>
        <li>Find usage instructions (how to add to your `conanfile.txt` or `conanfile.py`).</li>
      </ul>
      <!-- TODO: Include a screenshot or mock-up of Conan Center search results -->
      <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-3 h-24 flex items-center justify-center">
        <p class="text-gray-400 text-sm">[Visual Placeholder: Screenshot of Conan Center website showing a search for "fmt" and its result page.]</p>
      </div>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Command-Line Search</h3>
      <p class="text-gray-300 mb-2">Use <code class="text-orange-400">conan search</code> to find packages in remotes:</p>

      <p class="text-gray-400 mt-1">Search for all packages (can be very long!):</p>
      <pre><code class="language-bash">
      # Might list many packages, often better to be specific
      conan search "*" --remote=conancenter
      </code></pre>
      <p class="text-sm text-gray-500 mt-1 mb-2">Output: (Lists package names like <code class="text-green-400">fmt/10.2.1</code>, <code class="text-green-400">zlib/1.3</code>, etc.)</p>

      <p class="text-gray-400 mt-3">Search for packages matching a pattern (e.g., "boost"):</p>
      <pre><code class="language-bash">
      conan search "boost*" --remote=conancenter
      </code></pre>
      <p class="text-sm text-gray-500 mt-1 mb-2">Output: (Lists various Boost packages like <code class="text-green-400">boost/1.84.0</code>, <code class="text-green-400">bzip2/1.0.8</code> (as a Boost dep), etc.)</p>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3">Inspecting Package Details</h3>
    <p class="text-gray-300 mb-2">
      Use <code class="text-orange-400">conan inspect</code> to get detailed information about a specific package recipe from your local cache or a remote.
    </p>
    <pre><code class="language-bash">
    # Inspect the recipe for fmt/10.2.1 (ensure version exists)
    # The trailing '@' indicates no user/channel, common for Conan Center packages
    conan inspect fmt/10.2.1@
    </code></pre>
    <!-- TODO: Mockup or use an actual (abbreviated) output -->
    <pre><code class="language-text">
    # Example output snippet (can be quite verbose):
    name: fmt
    version: 10.2.1
    license: MIT
    description: A modern formatting library
    settings: os, arch, compiler, build_type
    options:
      shared: [True, False] (default: False)
      header_only: [True, False] (default: False)
      fPIC: [True, False] (default: True)
    ... (and much more)
    </code></pre>
  </div>

  <div class="mt-6">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Version Management Strategies</h3>
    <ul class="list-disc pl-6 space-y-2 text-gray-300 max-w-3xl mx-auto">
      <li><strong class="accent-text-cyan">Explicit Versions:</strong> <code class="text-orange-400">fmt/10.2.1</code> - Best for reproducibility in applications.</li>
      <li><strong class="accent-text-cyan">Version Ranges (Libraries):</strong> <code class="text-orange-400">fmt/[>=10.0 <11.0]</code> - Allows compatible updates, more common for library developers. Use with caution in applications.</li>
      <li><strong class="accent-text-cyan">Aliases:</strong> <code class="text-orange-400">fmt/stable</code> -> <code class="text-orange-400">fmt/10.2.1</code> - Can simplify updates but adds an indirection layer.</li>
      <li><strong class="accent-text-cyan">Lockfiles:</strong> The most robust way to ensure reproducible dependencies (covered later!).</li>
    </ul>
  </div>
</div>

---
layout: default
---

# 08. Building with CMake Integration
## Seamlessly Using Dependencies in Your CMake Project

<div class="mt-4">
  <p class="text-lg text-center mb-6">Conan excels at integrating with various build systems. Let's see how it works with CMake, using the <code class="text-orange-400">CMakeDeps</code> and <code class="text-orange-400">CMakeToolchain</code> generators.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-2">1. <code class="text-green-400">CMakeLists.txt</code> Setup</h3>
      <p class="text-gray-300 mb-2">Your CMake file will use <code class="text-orange-400">find_package()</code> as if the libraries were installed system-wide.</p>
      <pre><code class="language-cmake line-numbers">
      # CMakeLists.txt
      cmake_minimum_required(VERSION 3.15)
      project(ConanExample CXX) # Add CXX for C++

      # Conan: find_package() will use files generated by CMakeDeps
      # These files are typically in your build directory:
      # build/fmt-config.cmake, build/nlohmann_json-config.cmake etc.
      find_package(fmt REQUIRED)
      find_package(nlohmann_json REQUIRED)

      add_executable(${PROJECT_NAME} main.cpp)

      # Conan: Link to the imported targets provided by CMakeDeps
      target_link_libraries(${PROJECT_NAME} PRIVATE
          fmt::fmt                  # Target for fmt
          nlohmann_json::nlohmann_json # Target for nlohmann_json
      )
      </code></pre>
      <p class="text-sm text-gray-400 mt-2">
        <strong class="accent-text-orange">Key Points:</strong><br/>
        - <code class="text-green-400">find_package(LibName REQUIRED)</code>: Standard CMake way to find dependencies. <code class="textgreen-400">CMakeDeps</code> generates the necessary <code class="text-green-400">LibName-config.cmake</code> files. <br/>
        - <code class="text-green-400">LibName::LibName</code>: Modern CMake target names provided by Conan.
      </p>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-2">2. Build Process Steps</h3>
      <p class="text-gray-300 mb-2">Assuming <code class="text-orange-400">conanfile.txt</code> and <code class="text-orange-400">main.cpp</code> from before, and <code class="text-orange-400">cmake_layout</code> in <code class="text-orange-400">conanfile.txt</code>:</p>

      <p class="text-gray-300 mt-1 font-semibold">Step A: Install Dependencies</p>
      <pre><code class="language-bash">
      # From your project root (where conanfile.txt is)
      # This generates toolchain and dependency files in 'build/'
      conan install . --output-folder=build --build=missing
      </code></pre>
      <p class="text-sm text-gray-500 mt-1"><code class="text-orange-400">--output-folder=build</code>: Puts generated files into the build directory. <br/> <code class="text-orange-400">--build=missing</code>: Builds packages from source if binaries are not available for your profile.</p>

      <p class="text-gray-300 mt-3 font-semibold">Step B: Configure CMake</p>
      <pre><code class="language-bash">
      # Navigate to build folder
      cd build
      # Configure CMake using the Conan-generated toolchain
      cmake .. -DCMAKE_TOOLCHAIN_FILE=conan_toolchain.cmake -DCMAKE_BUILD_TYPE=Release
      cd ..
      </code></pre>
      <p class="text-sm text-gray-500 mt-1"><code class="text-orange-400">-DCMAKE_TOOLCHAIN_FILE</code>: Tells CMake to use Conan's settings (compiler, options, etc.).</p>

      <p class="text-gray-300 mt-3 font-semibold">Step C: Build Project</p>
      <pre><code class="language-bash">
      # From project root
      cmake --build build
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">Executable will be in <code class="text-orange-400">build/Release/</code> (or similar, depending on generator and OS).</p>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Troubleshooting & Tips</h3>
    <ul class="list-disc pl-6 space-y-2 text-gray-300 max-w-3xl mx-auto">
      <li><strong class="accent-text-orange">Toolchain Not Found:</strong> Ensure <code class="text-green-400">-DCMAKE_TOOLCHAIN_FILE</code> path is correct and generated by <code class="textgreen-400">conan install</code>.</li>
      <li><strong class="accent-text-orange">Packages Not Found by CMake:</strong> Verify <code class="textgreen-400">CMakeDeps</code> generated files are in CMake's search path (usually handled by the toolchain). Check <code class="textgreen-400">build/generators</code> directory.</li>
      <li><strong class="accent-text-orange">Profile Mismatch:</strong> Build issues can arise if the Conan profile used for <code class="textgreen-400">conan install</code> doesn't match the CMake configuration (e.g., different compilers or build types). The toolchain helps enforce consistency.</li>
      <li><strong class="accent-text-cyan">Clean Builds:</strong> When in doubt, remove the <code class="textgreen-400">build</code> directory and re-run <code class="textgreen-400">conan install</code> and CMake steps.</li>
      <li><strong class="accent-text-cyan">Performance:</strong> Use <code class="textgreen-400">--build=missing</code> judiciously. Pre-built binaries from your own server or Conan Center save significant time. (More on optimization later).</li>
    </ul>
  </div>
</div>

---
layout: default
---

# 09. Profiles Deep Dive
## Configuring Your Build Environment Precisely

<div class="mt-4">
  <p class="text-lg text-center mb-6">Profiles are a cornerstone of Conan, defining the context for your builds: settings, options, toolchains, and environment variables. They ensure <span class="accent-text-cyan">reproducibility and consistency</span>.</p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">What is a Profile?</h3>
      <p class="text-gray-300">
        A profile is a text file (INI-like format) that specifies the configuration for a Conan build. It typically includes:
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
        <li><code class="text-orange-400">[settings]</code>: Defines compiler, OS, architecture, build type (Debug/Release), C++ standard, etc. These determine binary compatibility.</li>
        <li><code class="text-orange-400">[options]</code>: Sets default options for packages (e.g., <code class="text-green-400">*:shared=True</code>).</li>
        <li><code class="text-orange-400">[conf]</code>: General configuration variables, often used to integrate tools (e.g., CMake variables, paths to tools).</li>
        <li><code class="text-orange-400">[tool_requires]</code>: Specifies build tools needed (e.g., CMake, Ninja, SCM tools).</li>
        <li><code class="text-orange-400">[env]</code>: Sets environment variables for the build.</li>
      </ul>
      <p class="text-gray-300 mt-2">
        Profiles are stored in <code class="text-orange-400">~/.conan2/profiles/</code>.
      </p>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Default Profile</h3>
      <p class="text-gray-300 mb-2">
        When you run <code class="text-orange-400">conan profile detect --force</code>, Conan creates/updates a <code class="text-green-400">default</code> profile based on your system.
      </p>
      <p class="text-gray-400 text-sm">Example <code class="text-orange-400">~/.conan2/profiles/default</code> (abbreviated):</p>
      <pre><code class="language-ini">
      [settings]
      os=Linux
      arch=x86_64
      compiler=gcc
      compiler.version=11
      compiler.libcxx=libstdc++11
      build_type=Release
      # ... other detected settings ...

      [conf]
      tools.cmake.cmaketoolchain:generator=Ninja
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">This profile is used if you don't specify one with <code class="text-orange-400">-pr</code> or <code class="text-orange-400">--profile</code>.</p>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Custom Profiles & Cross-Compilation</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div>
        <h4 class="text-xl accent-text-cyan mb-2">Creating Custom Profiles</h4>
        <p class="text-gray-300">
          Create new files in <code class="text-orange-400">~/.conan2/profiles/</code> (e.g., <code class="text-green-400">my_custom_profile</code>).
        </p>
        <p class="text-gray-400 text-sm mt-1">Example (<code class="textgreen-400">my_gcc11_release</code>):</p>
        <pre><code class="language-ini line-numbers">
        # ~/.conan2/profiles/my_gcc11_release
        [settings]
        os=Linux
        arch=x86_64
        compiler=gcc
        compiler.version=11
        compiler.libcxx=libstdc++11
        build_type=Release

        [conf]
        # Install system packages if needed (e.g., for recipes using system tools)
        tools.system.package_manager:mode=install
        tools.system.package_manager:sudo=True
        # Example: tools.cmake.cmaketoolchain:generator=Unix Makefiles
        </code></pre>
        <p class="text-gray-300 mt-2">
          Use it: <code class="text-orange-400">conan install . -pr=my_gcc11_release</code>
        </p>
      </div>
      <div>
        <h4 class="text-xl accent-text-cyan mb-2">Profiles for Cross-Compilation</h4>
        <p class="text-gray-300">
          Profiles are essential for cross-compiling. You typically use two profiles:
        </p>
        <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
          <li><strong>Build Profile (<code class="text-orange-400">-pr:b</code> or <code class="text-orange-400">--profile:build</code>):</strong> Defines the environment where the build runs (e.g., your Linux host). Often the <code class="text-green-400">default</code> profile.</li>
          <li><strong>Host Profile (<code class="text-orange-400">-pr:h</code> or <code class="text-orange-400">--profile:host</code>):</strong> Defines the target platform (e.g., Android, Raspberry Pi, embedded device).</li>
        </ul>
        <p class="text-gray-400 text-sm mt-2">Example: <code class="text-orange-400">conan install . -pr:h=android_profile -pr:b=default</code></p>
        <p class="text-gray-300 mt-1">The host profile would specify Android settings (OS, architecture, compiler like NDK's Clang).</p>
      </div>
    </div>
  </div>
</div>

---
layout: default
---

# 10. Advanced `conanfile.py`
## Unleashing Python Power in Your Recipes

<div class="mt-4">
  <p class="text-lg text-center mb-6">
    While <code class="text-orange-400">conanfile.txt</code> is great for consuming packages, <code class="text-green-400">conanfile.py</code> offers the full power of Python for creating packages, defining complex logic, and much more.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Why <code class="text-green-400">conanfile.py</code>?</h3>
      <ul class="list-disc pl-5 space-y-2 text-gray-300">
        <li><strong>Packaging Libraries:</strong> Essential for creating Conan packages of your own libraries.</li>
        <li><strong>Conditional Logic:</strong> Implement dynamic behavior based on settings, options, OS, etc.</li>
        <li><strong>Custom Build Steps:</strong> Define precisely how your library is built, configured, and packaged.</li>
        <li><strong>Source Management:</strong> Fetch sources from Git, archives, etc.</li>
        <li><strong>Extensibility:</strong> Use Python's vast ecosystem and Conan's API for advanced scenarios.</li>
      </ul>
      <p class="text-gray-300 mt-3">
        A <code class="text-green-400">conanfile.py</code> is a Python class that inherits from <code class="text-orange-400">ConanFile</code>.
      </p>
    </div>
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Example: Dynamic Dependencies</h3>
      <p class="text-gray-300 mb-1">
        This example shows a <code class="text-green-400">conanfile.py</code> that adds <code class="text-orange-400">gtest</code> only for Debug builds.
      </p>
      <pre><code class="language-python line-numbers">
      # conanfile.py
      from conan import ConanFile
      from conan.tools.cmake import CMakeDeps, CMakeToolchain, cmake_layout

      class MyProjectConan(ConanFile):
          settings = "os", "compiler", "build_type", "arch"

          # Define common requirements
          def requirements(self):
              self.requires("fmt/10.2.1")
              # Conditionally add gtest for Debug builds
              if self.settings.build_type == "Debug":
                  self.requires("gtest/1.14.0")

          # Generate build system files (CMake example)
          def generate(self):
              deps = CMakeDeps(self)
              deps.generate()
              tc = CMakeToolchain(self)
              # You can customize the toolchain here, e.g.:
              # tc.variables["MY_CUSTOM_CMAKE_VAR"] = "VALUE"
              tc.generate()

          # Define project layout (source, build folders)
          def layout(self):
              cmake_layout(self)
              # For more complex layouts, you can customize:
              # self.folders.source = "src"
              # self.folders.build = "cmake-build"

          # Other common methods for packaging:
          # def package_info(self): # Defines consumer info (libs, includes)
          # def package(self):      # Copies artifacts to package folder
          # def build(self):        # Defines how to build the library
          # def source(self):       # Defines how to get sources
      </code></pre>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Key Methods & Capabilities</h3>
    <div class="max-w-4xl mx-auto text-gray-300">
      <ul class="list-disc pl-5 space-y-2">
        <li><code class="text-orange-400">settings</code>: Declares the settings your recipe cares about (OS, compiler, etc.).</li>
        <li><code class="text-orange-400">requirements()</code>: Define package dependencies. Can use <code class="textgreen-400">if/else</code> for conditional logic.</li>
        <li><code class="text-orange-400">generate()</code>: Create files needed for consumers to build and use the package (e.g., toolchain files, dependency information files).</li>
        <li><code class="text-orange-400">layout()</code>: Define the folder structure for sources, build artifacts, etc.</li>
        <li><strong class="accent-text-cyan">For Packaging Your Library (more advanced):</strong>
          <ul class="list-disc pl-5 space-y-1 text-sm text-gray-400">
            <li><code class="text-orange-400">source()</code>: Get source code (e.g., from git, download tarball).</li>
            <li><code class="text-orange-400">build()</code>: Compile the library from sources.</li>
            <li><code class="text-orange-400">package()</code>: Copy artifacts (headers, libs, binaries) into the package folder.</li>
            <li><code class="text-orange-400">package_info()</code>: Declare what consumers need (include dirs, lib names, defines).</li>
          </ul>
        </li>
        <li><strong class="accent-text-cyan">Hooks and Extensions:</strong> Conan allows custom Python scripts (<code class="textgreen-400">hooks</code>) to extend behavior at different lifecycle stages (e.g., pre-export, post-build).</li>
      </ul>
    </div>
  </div>
</div>


---
layout: default
---

# 11. Versioning & Lockfiles
## Ensuring Stability and Reproducibility

<div class="mt-4">
  <p class="text-lg text-center mb-6">
    Managing versions effectively is key to stable C++ projects. Conan provides robust mechanisms for versioning and ensuring that your builds are reproducible every time.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Semantic Versioning (SemVer)</h3>
      <p class="text-gray-300">
        Conan packages typically follow <a href="https://semver.org/" target="_blank" class="text-cyan-400 hover:text-orange-400">Semantic Versioning (MAJOR.MINOR.PATCH)</a>:
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
        <li><strong class="accent-text-orange">MAJOR:</strong> Incompatible API changes.</li>
        <li><strong class="accent-text-cyan">MINOR:</strong> Add functionality in a backward-compatible manner.</li>
        <li><strong class="accent-text-purple">PATCH:</strong> Backward-compatible bug fixes.</li>
      </ul>
      <p class="text-gray-300 mt-2">
        Conan uses these rules when resolving version ranges.
      </p>

      <h3 class="text-2xl font-semibold accent-text-purple mt-6 mb-3">Version Ranges & Conflicts</h3>
      <p class="text-gray-300">
        You can specify version requirements flexibly:
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-sm text-gray-400">
        <li>Exact version: <code class="text-green-400">fmt/10.2.1</code></li>
        <li>Greater than: <code class="text-green-400">fmt/>10.0.0</code></li>
        <li>Compatible with minor: <code class="text-green-400">fmt/~10.2</code> (equivalent to <code class="text-green-400">>=10.2.0 <11.0.0</code>)</li>
        <li>Range: <code class="text-green-400">fmt/[>=10.0 <11.0]</code></li>
      </ul>
      <p class="text-gray-300 mt-2">
        <strong class="accent-text-orange">Conflict Resolution:</strong> By default, Conan resolves conflicts to the <span class="accent-text-cyan">minimum compatible version</span> within the allowed ranges, or the highest version if multiple unrelated ranges are specified for the same direct dependency. More complex scenarios might require explicit overrides or lockfiles.
      </p>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Lockfiles for Reproducibility</h3>
      <p class="text-gray-300 mb-2">
        A <strong class="accent-text-cyan">lockfile</strong> captures the exact versions and revisions of all dependencies in your graph, ensuring that every build is identical.
      </p>

      <p class="text-gray-300 font-semibold">1. Generating a Lockfile:</p>
      <pre><code class="language-bash">
      # Based on your conanfile.txt or conanfile.py
      conan lock create conanfile.txt --out=project.lock
      # For conanfile.py
      # conan lock create . --out=project.lock
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">This creates <code class="text-green-400">project.lock</code> with the resolved dependency graph.</p>

      <p class="text-gray-300 mt-4 font-semibold">2. Using a Lockfile:</p>
      <pre><code class="language-bash">
      # Install dependencies using the exact versions from the lockfile
      conan install . --lockfile=project.lock --build=missing

      # If creating a package, use the lockfile too
      conan create . --lockfile=project.lock --build=missing
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">Using <code class="text-orange-400">--lockfile</code> ensures that Conan doesn't re-resolve versions, providing deterministic builds.</p>

      <p class="text-gray-300 mt-3">
        Commit your <code class="text-green-400">project.lock</code> file to your version control system (e.g., Git) alongside your conanfile.
      </p>
    </div>
  </div>

  <div class="mt-8 text-center">
    <h3 class="text-xl font-semibold accent-text-purple mb-3">Why Lockfiles are Crucial</h3>
    <p class="text-gray-300 max-w-3xl mx-auto">
      Even if you pin exact versions in <code class="text-orange-400">[requires]</code>, transitive dependencies might have version ranges. Lockfiles capture the <span class="accent-text-cyan">entire graph</span>, including revisions (<code class="text-orange-400">#revision_hash</code>), making them the ultimate tool for reproducible builds, especially in CI/CD and team environments.
    </p>
  </div>
</div>

---
layout: default
---

# 12. Creating Your Own Packages
## Sharing Your C++ Libraries with Conan

<div class="mt-4">
  <p class="text-lg text-center mb-6">
    Conan isn't just for consuming packages; it's also a powerful tool for creating, building, and distributing your own C++ libraries and applications. This typically involves writing a <code class="text-green-400">conanfile.py</code>.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">1. Scaffolding a New Package</h3>
      <p class="text-gray-300 mb-2">
        The <code class="text-orange-400">conan new</code> command helps you start a new package with a template:
      </p>
      <pre><code class="language-bash">
      # Create a template for a CMake-based library
      conan new mylib/0.1.0 --template=cmake_lib
      # This creates:
      # mylib/
      # ├── conanfile.py  (pre-filled recipe)
      # ├── src/          (source files for your library)
      # │   ├── mylib.cpp
      # │   └── mylib.h
      # ├── CMakeLists.txt (CMake script for your library)
      # └── test_package/ (a small project to test your package)
      #     ├── conanfile.py
      #     ├── CMakeLists.txt
      #     └── src/example.cpp
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">
        Other templates exist (e.g., <code class="text-green-400">cmake_exe</code>, <code class="text-green-400">meson_lib</code>, <code class="text-green-400">basic</code>). Explore with <code class="text-orange-400">conan new --list-templates</code>.
      </p>

      <h3 class="text-2xl font-semibold accent-text-purple mt-6 mb-3">2. The <code class="text-green-400">conan create</code> Workflow</h3>
      <p class="text-gray-300 mb-2">
        Once your <code class="textgreen-400">conanfile.py</code> and sources are ready:
      </p>
      <pre><code class="language-bash">
      # From the directory containing your conanfile.py (e.g., 'mylib/')
      conan create . # user/channel can be specified if needed
      # Example: conan create . --name=mylib --version=0.1.0 --user=myuser --channel=stable
      </code></pre>
      <p class="text-gray-300 mt-1">
        This command performs several steps:
      </p>
      <ul class="list-disc pl-5 space-y-1 text-gray-400">
        <li>Reads your <code class="textgreen-400">conanfile.py</code>.</li>
        <li>Runs <code class="text-orange-400">source()</code> method (if defined) to get source code.</li>
        <li>Runs <code class="text-orange-400">build()</code> method to compile your library.</li>
        <li>Runs <code class="text-orange-400">package()</code> method to copy artifacts into a package layout.</li>
        <li>Builds and runs the <code class="text-green-400">test_package</code> to validate the created package.</li>
        <li>Stores the package in your local Conan cache.</li>
      </ul>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">3. Key <code class="text-green-400">conanfile.py</code> Methods for Packaging</h3>
      <p class="text-gray-300 mb-2">
        Your recipe defines how your library is built and packaged:
      </p>
      <ul class="list-disc pl-5 space-y-1 text-gray-300 text-sm">
        <li><code class="text-orange-400">name, version, user, channel</code>: Attributes defining the package reference.</li>
        <li><code class="text-orange-400">settings, options</code>: Define compatibility and configurability.</li>
        <li><code class="text-orange-400">exports_sources</code>: Specifies source files/folders to be included from your working directory into the package source folder.</li>
        <li><code class="text-orange-400">layout()</code>: Defines project structure (source, build, package folders).</li>
        <li><code class="text-orange-400">generate()</code>: Prepares information for the build system (e.g., via <code class="textgreen-400">CMakeToolchain</code>, <code class="textgreen-400">CMakeDeps</code>).</li>
        <li><code class="text-orange-400">source()</code>: Method to fetch source code (e.g., <code class="text-green-400">self.run("git clone ...")</code> or <code class="text-green-400">get()</code> helper for archives). If sources are local (via <code class="text.orange-400">exports_sources</code>), this might be empty.</li>
        <li><code class="text-orange-400">build()</code>: Contains logic to compile the library (e.g., invoking CMake, Make, MSBuild).</li>
        <li><code class="text-orange-400">package()</code>: Copies build artifacts (headers, libraries, binaries) from build folders to the final package folder. Uses <code class="text-green-400">copy()</code> helper.</li>
        <li><code class="text-orange-400">package_info()</code>: Declares information for consumers (include dirs, lib dirs, library names, defines, etc.). Crucial for downstream usage.</li>
      </ul>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">4. Testing & Publishing</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <h4 class="text-xl accent-text-cyan">Testing with <code class="text-green-400">test_package</code></h4>
        <p class="text-gray-300">
          The <code class="text-green-400">test_package</code> folder contains a minimal consumer project. <code class="text-orange-400">conan create</code> automatically builds and runs it to ensure your package works correctly. This is a vital part of package validation.
        </p>
      </div>
      <div>
        <h4 class="text-xl accent-text-cyan">Publishing to a Remote</h4>
        <p class="text-gray-300">
          Once created and tested, upload your package to a remote repository:
        </p>
        <pre><code class="language-bash">
        # Upload mylib/0.1.0 to 'my_remote' (configured in conan remote list)
        conan upload mylib/0.1.0 --remote=my_remote --all
        # --all uploads recipe and all binary packages
        </code></pre>
        <p class="text-sm text-gray-500 mt-1">Now others can consume your package!</p>
      </div>
    </div>
  </div>
</div>

---
layout: default
---

# 13. Conan Center vs Private Repositories
## Managing Where Your Packages Live

<div class="mt-4">
  <p class="text-lg text-center mb-6">
    Conan packages are stored and retrieved from <span class="accent-text-cyan">remotes</span>. Understanding the difference between the public Conan Center and private repositories is crucial for effective C++ supply chain management.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Conan Center</h3>
      <img src="https://conan.io/assets/conan-logo-card.png" alt="Conan Center Logo" class="h-12 mb-2"/>
      <p class="text-gray-300">
        The <a href="https://conan.io/center/" target="_blank" class="text-cyan-400 hover:text-orange-400">official, public repository</a> for thousands of open-source C++ packages.
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
        <li><strong>Pros:</strong> Vast collection of popular libraries, community-maintained, easy to get started. Default remote for new Conan installations.</li>
        <li><strong>Cons/Considerations:</strong> Relies on community for updates and quality. May not have every specific version or configuration you need. Public nature means not suitable for proprietary code.</li>
        <li><strong>Use Cases:</strong> Accessing common OSS libraries (Boost, OpenSSL, fmt, etc.).</li>
      </ul>
      <p class="text-sm text-gray-500 mt-2">
        Default remote name: <code class="text-orange-400">conancenter</code>
      </p>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Private Repositories</h3>
      <p class="text-gray-300">
        Self-hosted or managed repositories for your organization's packages.
      </p>
      <ul class="list-disc pl-5 space-y-1 mt-2 text-gray-300">
        <li><strong>Pros:</strong> Full control over content, security, and access. Host proprietary packages. Cache approved Conan Center packages. Ensure build reproducibility with known, vetted binaries.</li>
        <li><strong>Solutions:</strong>
          <ul class="list-disc pl-5 space-y-1 text-sm text-gray-400">
            <li><strong class="accent-text-cyan">JFrog Artifactory:</strong> Robust, enterprise-grade binary repository manager with excellent Conan support.</li>
            <li><strong class="accent-text-cyan">Sonatype Nexus Repository OSS/Pro:</strong> Another popular choice for managing binaries.</li>
            <li><strong class="accent-text-cyan">Self-hosted <code class="text-orange-400">conan_server</code>:</strong> A simple, open-source server provided by Conan for smaller teams or basic needs.</li>
          </ul>
        </li>
        <li><strong>Use Cases:</strong> Internal libraries, forks of OSS packages, audited/approved external packages, enforcing binary policies.</li>
      </ul>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">Working with Private Remotes</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <h4 class="text-xl accent-text-cyan mb-2">Adding a Private Remote</h4>
        <p class="text-gray-300 mb-1">
          Use <code class="text-orange-400">conan remote add</code>:
        </p>
        <pre><code class="language-bash">
        # Example for Artifactory (replace with your details)
        conan remote add mycompany https://artifactory.mycompany.com/artifactory/api/conan/conan-local
        # Add credentials if required
        conan remote login mycompany your_username
        </code></pre>
        <p class="text-sm text-gray-500 mt-1">List remotes with <code class="text-orange-400">conan remote list</code>.</p>
      </div>
      <div>
        <h4 class="text-xl accent-text-cyan mb-2">Security & Enterprise Patterns</h4>
        <ul class="list-disc pl-5 space-y-1 text-gray-300">
          <li><strong>Permissions:</strong> Control who can read from or write to specific repositories/paths.</li>
          <li><strong>Auditing:</strong> Track package downloads/uploads.</li>
          <li><strong>Proxying Conan Center:</strong> Configure your private remote to act as a cache for Conan Center. Developers only interact with your remote, improving speed and control.</li>
          <li><strong>Package Promotion:</strong> Use multiple private repositories (e.g., <code class="text-green-400">dev-repo</code>, <code class="text-green-400">staging-repo</code>, <code class="text-green-400">release-repo</code>) and promote packages through them as they pass QA.</li>
        </ul>
      </div>
    </div>
  </div>
</div>

---
layout: default
---

# 14. Multi-Platform Development
## Building for Diverse Targets with Conan

<div class="mt-4">
  <p class="text-lg text-center mb-6">
    Conan's robust support for profiles and its build system integrations make it well-suited for multi-platform C++ development, including cross-compilation and CI/CD automation.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Cross-Compilation with Profiles</h3>
      <p class="text-gray-300 mb-2">
        As discussed in "Profiles Deep Dive", Conan uses two profiles for cross-compilation:
      </p>
      <ul class="list-disc pl-5 space-y-1 text-gray-300">
        <li><strong class="accent-text-orange">Build Profile (<code class="text-green-400">-pr:b</code>):</strong> Describes the machine where the compilation happens (e.g., Linux x86_64). Often your <code class="textgreen-400">default</code> profile.</li>
        <li><strong class="accent-text-cyan">Host Profile (<code class="text-green-400">-pr:h</code>):</strong> Describes the target system where the code will run (e.g., Android ARMv8, Windows x86, Raspberry Pi).</li>
      </ul>
      <pre><code class="language-bash">
      # Example: Building for Android on a Linux host
      conan install . -pr:h=profiles/android-armv8 -pr:b=default --build=missing
      # or when creating a package
      conan create . -pr:h=profiles/android-armv8 -pr:b=default --build=missing
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">
        The <code class="text-green-400">android-armv8</code> profile would define target OS, architecture, compiler (Android NDK's Clang), SDK paths, etc.
      </p>
      <p class="text-gray-300 mt-2">
        Conan manages toolchains and dependencies for both build and host contexts.
      </p>
    </div>

    <div>
      <h3 class="text-2xl font-semibold accent-text-purple mb-3">Docker for Consistent Environments</h3>
      <p class="text-gray-300 mb-2">
        Docker containers provide isolated, reproducible build environments:
      </p>
      <ul class="list-disc pl-5 space-y-1 text-gray-300">
        <li>Encapsulate specific OS versions, compilers, SDKs, and tools.</li>
        <li>Ensure developers and CI servers use the exact same environment.</li>
        <li>Conan runs seamlessly inside Docker containers.</li>
      </ul>
      <pre><code class="language-dockerfile">
      # Example Dockerfile snippet
      FROM ubuntu:22.04
      RUN apt-get update && apt-get install -y python3 python3-pip cmake g++
      RUN pip3 install conan

      # Set up Conan default profile (or copy custom ones)
      RUN conan profile detect --force

      WORKDIR /app
      # Copy your project and run conan install/create
      </code></pre>
      <p class="text-sm text-gray-500 mt-1">
        Ideal for building Linux targets or cross-compiling using specific toolchains installed within the container.
      </p>
    </div>
  </div>

  <div class="mt-8">
    <h3 class="text-2xl font-semibold accent-text-purple mb-3 text-center">CI/CD Integration & Platform Specifics</h3>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <div>
        <h4 class="text-xl accent-text-cyan">CI/CD Pipeline Examples</h4>
        <p class="text-gray-300">
          Conan commands integrate directly into CI/CD scripts (GitHub Actions, Jenkins, GitLab CI, etc.) to automate builds, testing, and packaging for multiple platforms.
        </p>
        <!-- TODO: Add example CI script snippets -->
        <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-2 h-24 flex items-center justify-center">
          <p class="text-gray-400 text-sm">[Placeholder: GitHub Actions workflow snippet showing matrix builds for different OS/compilers using Conan profiles.]</p>
        </div>
         <div class="border-2 border-dashed border-gray-600 p-4 rounded-lg text-center mt-2 h-24 flex items-center justify-center">
          <p class="text-gray-400 text-sm">[Placeholder: Jenkins pipeline script snippet demonstrating Conan install and create steps.]</p>
        </div>
      </div>
      <div>
        <h4 class="text-xl accent-text-cyan">Platform-Specific Logic in <code class="text-green-400">conanfile.py</code></h4>
        <p class="text-gray-300">
          Your <code class="text-green-400">conanfile.py</code> can adapt to different platforms:
        </p>
        <pre><code class="language-python">
        # Example in conanfile.py
        from conan.tools.apple import is_apple_os

        # ...
        def requirements(self):
            if self.settings.os == "Windows":
                self.requires("win_specific_lib/1.0")
            if is_apple_os(self): # macOS, iOS, tvOS, watchOS
                self.requires("apple_framework_wrapper/1.0")

        def package_info(self):
            if self.settings.os == "Linux":
                self.cpp_info.system_libs.append("pthread")
        </code></pre>
        <p class="text-sm text-gray-500 mt-1">This allows fine-grained control over dependencies and build configurations for each target platform.</p>
      </div>
    </div>
  </div>
</div>
