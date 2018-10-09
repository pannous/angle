/*
package hello

import com.intellij.openapi.util.Disposer
import com.intellij.psi.search.GlobalSearchScope
import org.jetbrains.kotlin.analyzer.ModuleContent
import org.jetbrains.kotlin.analyzer.ModuleInfo
import org.jetbrains.kotlin.analyzer.PlatformAnalysisParameters
import org.jetbrains.kotlin.analyzer.common.DefaultAnalyzerFacade
import org.jetbrains.kotlin.cli.common.CLIConfigurationKeys
import org.jetbrains.kotlin.cli.common.messages.CompilerMessageLocation
import org.jetbrains.kotlin.cli.common.messages.CompilerMessageSeverity
import org.jetbrains.kotlin.cli.common.messages.GroupingMessageCollector
import org.jetbrains.kotlin.cli.common.messages.MessageCollector
import org.jetbrains.kotlin.cli.jvm.compiler.EnvironmentConfigFiles
import org.jetbrains.kotlin.cli.jvm.compiler.JvmPackagePartProvider
import org.jetbrains.kotlin.cli.jvm.compiler.KotlinCoreEnvironment
import org.jetbrains.kotlin.cli.jvm.config.addJvmClasspathRoots
import org.jetbrains.kotlin.config.CompilerConfiguration
import org.jetbrains.kotlin.config.addKotlinSourceRoot
import org.jetbrains.kotlin.container.get
import org.jetbrains.kotlin.context.ProjectContext
import org.jetbrains.kotlin.descriptors.ModuleDescriptor
import org.jetbrains.kotlin.load.java.JvmAbi
import org.jetbrains.kotlin.name.Name
import org.jetbrains.kotlin.psi.KtBlockExpression
import org.jetbrains.kotlin.resolve.LazyTopDownAnalyzer
import org.jetbrains.kotlin.resolve.MultiTargetPlatform
import org.jetbrains.kotlin.resolve.TopDownAnalysisContext
import org.jetbrains.kotlin.resolve.TopDownAnalysisMode
import org.jetbrains.kotlin.utils.PathUtil
import java.io.File
import java.util.*
import java.util.logging.Logger

class KotlinScriptParser {
    private class SourceModuleInfo(
            override val name: Name,
            override val capabilities: Map<ModuleDescriptor.Capability<*>, Any?>,
            private val dependOnOldBuiltIns: Boolean
    ) : ModuleInfo {
        override fun dependencies() = listOf(this)

        override fun dependencyOnBuiltIns(): ModuleInfo.DependencyOnBuiltIns =
                if (dependOnOldBuiltIns) ModuleInfo.DependenciesOnBuiltIns.LAST else ModuleInfo.DependenciesOnBuiltIns.NONE
    }

    companion object {
        private val LOG = Logger.getLogger(KotlinScriptParser::class.java.name)
        private val messageCollector = object : MessageCollector {
            private var hasErrors = false
            override fun clear() {
                hasErrors = false
            }

            override fun hasErrors(): Boolean {
                return hasErrors
            }

            override fun report(severity: CompilerMessageSeverity, message: String, location: CompilerMessageLocation) {
                val path = location.path
                val position = if (path == null) "" else "$path: (${location.line}, ${location.column}) "

                val text = position + message

                if (CompilerMessageSeverity.VERBOSE.contains(severity)) {
                    LOG.finest(text)
                } else if (CompilerMessageSeverity.ERRORS.contains(severity)) {
                    LOG.severe(text)
                    hasErrors = true
                } else if (severity == CompilerMessageSeverity.INFO) {
                    LOG.info(text)
                } else {
                    LOG.warning(text)
                }
            }
        }

        private val classPath: ArrayList<File> by lazy {
            val classpath = arrayListOf<File>()
            classpath += PathUtil.getResourcePathForClass(AnnotationTarget.CLASS.javaClass)
            classpath
        }
    }

    fun parse(vararg files: String): TopDownAnalysisContext {
        // The Kotlin compiler configuration
        val configuration = CompilerConfiguration()

        val groupingCollector = GroupingMessageCollector(messageCollector)
        val severityCollector = GroupingMessageCollector(groupingCollector)
        configuration.put(CLIConfigurationKeys.MESSAGE_COLLECTOR_KEY, severityCollector)


        configuration.addJvmClasspathRoots(PathUtil.getJdkClassesRoots())
        // The path to .kt files sources
        files.forEach { configuration.addKotlinSourceRoot(it) }
        // Configuring Kotlin class path
        configuration.addJvmClasspathRoots(classPath)

        val rootDisposable = Disposer.newDisposable()
        try {
            val environment = KotlinCoreEnvironment.createForProduction(rootDisposable, configuration, EnvironmentConfigFiles.JVM_CONFIG_FILES)
            val ktFiles = environment.getSourceFiles()

            val capabilities: Map<ModuleDescriptor.Capability<*>, Any?> = mapOf(MultiTargetPlatform.CAPABILITY to MultiTargetPlatform.Common)

            val moduleInfo = SourceModuleInfo(Name.special("<${JvmAbi.DEFAULT_MODULE_NAME}"), capabilities, false)
            val project = ktFiles.firstOrNull()?.project ?: throw AssertionError("No files to analyze")
            val resolver = DefaultAnalyzerFacade.setupResolverForProject(
                    "sources for metadata serializer",
                    ProjectContext(project), listOf(moduleInfo),
                    { ModuleContent(ktFiles, GlobalSearchScope.allScope(project)) },
                    object : PlatformAnalysisParameters {},
                    packagePartProviderFactory = {
                        _, content -> JvmPackagePartProvider(environment, content.moduleContentScope)
                    },
                    modulePlatforms = { MultiTargetPlatform.Common }
            )

            val container = resolver.resolverForModule(moduleInfo).componentProvider

            return container.get<LazyTopDownAnalyzer>().analyzeDeclarations(TopDownAnalysisMode.TopLevelDeclarations, ktFiles)
        } finally {
            rootDisposable.dispose()
            if (severityCollector.hasErrors()) {
                throw RuntimeException("Compilation error")
            }
        }
    }
}


fun main(params: Array<String>) {
    val scriptFile = "/media/data/java/blackfern/kotlin-compile-test/test.kt"

    val parser = KotlinScriptParser()

    val analyzeContext = parser.parse(scriptFile)

    val function = analyzeContext.functions.keys.first()
    val body = function.bodyExpression as KtBlockExpression
    val i = 0;
}
*/