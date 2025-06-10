const { execSync } = require("child_process")
const fs = require("fs")
const path = require("path")

console.log("Installing PhonePe SDK...")

try {
  // First, try to install the package
  execSync(
    "npm install https://phonepe.mycloudrepo.io/public/repositories/phonepe-pg-sdk-node/releases/v2/phonepe-pg-sdk-node.tgz",
    {
      stdio: "inherit",
    },
  )

  console.log("PhonePe SDK installed successfully!")

  // Check if the package is properly installed
  const packageJsonPath = path.join(__dirname, "..", "node_modules", "phonepe-pg-sdk-node", "package.json")

  if (fs.existsSync(packageJsonPath)) {
    console.log("PhonePe SDK package found in node_modules")

    // Read the package.json to verify
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"))
    console.log(`PhonePe SDK version: ${packageJson.version}`)
  } else {
    console.log("PhonePe SDK package not found in node_modules")
  }
} catch (error) {
  console.error("Error installing PhonePe SDK:", error.message)
  console.log("\nTrying alternative installation method...")

  try {
    // Alternative method using npm install with --force
    execSync(
      "npm install --force https://phonepe.mycloudrepo.io/public/repositories/phonepe-pg-sdk-node/releases/v2/phonepe-pg-sdk-node.tgz",
      {
        stdio: "inherit",
      },
    )
    console.log("PhonePe SDK installed successfully with --force flag!")
  } catch (altError) {
    console.error("Alternative installation also failed:", altError.message)
    console.log("\nPlease try manual installation:")
    console.log("1. Download the package manually from the PhonePe repository")
    console.log("2. Or contact PhonePe support for installation instructions")
  }
}
